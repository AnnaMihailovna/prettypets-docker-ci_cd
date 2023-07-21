import re
from http import HTTPStatus
from pathlib import Path
from typing import Optional

import requests


def _get_validated_link(
        deploy_file_info: tuple[Path, str],
        deploy_info_file_content: dict[str, str],
        link_key: str
        ) -> str:
    _, path_to_deploy_info_file = deploy_file_info
    assert link_key in deploy_info_file_content, (
        f'Убедитесь, что файл `{path_to_deploy_info_file}` содержит ключ '
        f'`{link_key}`.'
    )
    link: str = deploy_info_file_content[link_key]
    assert link.startswith('https'), (
        f'Убедитесь, что cсылка ключ `{link_key}` в файле '
        f'`{path_to_deploy_info_file}` содержит ссылку, которая начинается с '
        'префикса `https`.'
    )
    link_pattern = re.compile(
        r'^https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.'
        r'[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$'
    )
    assert link_pattern.match(link), (
        f'Убедитесь, что ключ `{link_key}` в файле '
        f'`{path_to_deploy_info_file}` содержит корректную ссылку.'
    )
    return link.rstrip('/')


def _make_safe_request(link: str, stream: bool = False) -> requests.Response:
    try:
        response = requests.get(link, stream=stream)
    except requests.exceptions.SSLError:
        raise AssertionError(
            f'Убедитесь, что настроили шифрование для `{link}`.'
        )
    except requests.exceptions.ConnectionError:
        raise AssertionError(
            f'Убедитесь, что URL `{link}` доступен.'
        )
    expected_status = HTTPStatus.OK
    assert response.status_code == expected_status, (
        f'Убедитесь, что GET-запрос к `{link}` возвращает ответ со статусом '
        f'{int(expected_status)}.'
    )
    return response


def _get_js_link(response: requests.Response) -> Optional[str]:
    js_link_pattern = re.compile(r'static/js/[^\"]+')
    search_result = re.search(js_link_pattern, response.text)
    return search_result.group(0) if search_result else None


def test_link_connection(
        deploy_file_info: tuple[Path, str],
        deploy_info_file_content: dict[str, str],
        link_key: str
        ) -> None:
    link = _get_validated_link(deploy_file_info, deploy_info_file_content,
                               link_key)
    response = _make_safe_request(link)
    cats_project_name = 'Kittygram'
    taski_project_name = 'Taski'
    assert_msg_template = (
        f'Убедитесь, что по ссылке `{link}` доступен проект '
        '`{project_name}`.'
    )
    if link_key == 'kittygram_domain':
        assert cats_project_name in response.text, (
            assert_msg_template.format(project_name=cats_project_name)
        )
    else:
        assert_msg = assert_msg_template.format(
            project_name=taski_project_name
        )
        js_link = _get_js_link(response)
        assert js_link, assert_msg
        try:
            taski_response = requests.get(f'{link}/{js_link}')
        except requests.exceptions.ConnectionError:
            raise AssertionError(assert_msg)
        assert taski_response.status_code == HTTPStatus.OK, assert_msg
        assert taski_project_name in taski_response.text, assert_msg


def test_projects_on_same_ip(
        deploy_file_info: tuple[Path, str],
        deploy_info_file_content: dict[str, str],
        kittygram_link_key: str, taski_link_key: str
        ) -> None:
    links = [
        _get_validated_link(deploy_file_info, deploy_info_file_content,
                            link_key)
        for link_key in (kittygram_link_key, taski_link_key)
    ]
    responses = [_make_safe_request(link, stream=True) for link in links]
    ips = [
        response.raw._original_response.fp.raw._sock.getpeername()[0]
        for response in responses
    ]
    assert ips[0] == ips[1], (
        'Убедитесь, что оба проекта развернуты на одном сервере. В ходе '
        'проверки обнаружено, что проекты размещены на разных ip-адресах.'
    )


def test_kittygram_static_is_available(
        deploy_file_info: tuple[Path, str],
        deploy_info_file_content: dict[str, str],
        kittygram_link_key: str
        ) -> None:
    link = _get_validated_link(deploy_file_info, deploy_info_file_content,
                               kittygram_link_key)
    response = _make_safe_request(link)

    js_link = _get_js_link(response)
    assert js_link, (
        'Проверьте, что проект `Kittygram` настроен корректно. '
        f'В ответе на запрос к `{link}` не обнаружена ссылка на '
        'JavaScript-файл.'
    )

    assert_msg = 'Убедитесь, что статические файлы для `Kittygram` доступны.'
    js_link_response = requests.get(f'{link}/{js_link}')
    expected_status = HTTPStatus.OK
    assert js_link_response.status_code == expected_status, assert_msg


def test_kittygram_api_available(
        deploy_file_info: tuple[Path, str],
        deploy_info_file_content: dict[str, str],
        kittygram_link_key: str
        ) -> None:
    link = _get_validated_link(deploy_file_info, deploy_info_file_content,
                               kittygram_link_key)
    signup_link = f'{link}/api/users/'
    form_data = {
        'username': 'newuser',
        'password': ''
    }
    assert_msg = (
        'Убедитесь, что API проекта `Kittygram` доступен по ссылке формата '
        f'`{link}/api/...`.'
    )
    try:
        response = requests.post(signup_link, data=form_data)
    except requests.exceptions.SSLError:
        raise AssertionError(
            f'Убедитесь, что настроили шифрование для `{link}`.'
        )
    except requests.ConnectionError:
        raise AssertionError(assert_msg)
    expected_status = HTTPStatus.BAD_REQUEST
    assert response.status_code == expected_status, assert_msg
    assert 'password' in response.json(), assert_msg

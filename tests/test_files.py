from pathlib import Path

import yaml


def test_infra_files_exist(nginx_dir_info: tuple[Path, str],
                           expected_nginx_files: set[str]):
    path, dir_name = nginx_dir_info
    nginx_dir_content = {obj.name for obj in path.glob('*') if obj.is_file()}
    missing_files = expected_nginx_files - nginx_dir_content
    action = 'создан файл' if len(missing_files) < 2 else 'созданы файлы'
    assert not missing_files, (
        f'Убедитесь, что в директории `{dir_name}/` {action} '
        f'`{"`, `".join(missing_files)}`.'
    )


def test_deploy_info_file_content(
        deploy_file_info: tuple[Path, str],
        deploy_info_file_content: dict[str, str],
        expected_deploy_info_file_content: dict[str, str]
        ):
    _, relative_path = deploy_file_info
    missing_content = {
        key: value for key, value in expected_deploy_info_file_content.items()
        if key not in deploy_info_file_content
    }
    action = 'содержится' if len(missing_content) < 2 else 'содержатся'
    key_word_form = 'ключ' if len(missing_content) < 2 else 'ключи'
    assert not missing_content, (
        f'Убедитесь, что в файле `{relative_path}` {action} '
        f'{", ".join(missing_content.values())}. Для вывода этой '
        f'информации необходимо использовать {key_word_form} '
        f'`{"`, `".join(missing_content.keys())}`.'
    )


def test_backend_dockerfile_exists(backend_dir_info: tuple[Path, str],
                                   dockerfile_name: str):
    path, relative_path = backend_dir_info
    assert (path / dockerfile_name).is_file(), (
        f'Убедитесь, что в директории `{relative_path}/` создан файл '
        f'`{dockerfile_name}.'
    )


def test_backend_dokerfile_content(backend_dir_info: tuple[Path, str],
                                   dockerfile_name: str):
    path, _ = backend_dir_info
    with open(path / dockerfile_name, encoding='utf-8', errors='ignore') as f:
        dockerfile_content = f.read()
    expected_keywords = ('from', 'run', 'cmd')
    for keyword in expected_keywords:
        assert keyword in dockerfile_content.lower(), (
            f'Убедитесь, что настроили {dockerfile_name} для образа '
            '`kittygram_backend`.'
        )


def test_workflow_file(base_dir: Path, workflow_file_name: str):
    path_to_file = base_dir / workflow_file_name
    assert path_to_file.is_file(), (
        f'Убедитесь, что корневая директория проекта содержит файл '
        f'`{workflow_file_name}`, в котором описан workflow для Kittygram.'
    )
    with open(path_to_file, 'r', encoding='utf-8', errors='ignore') as stream:
        try:
            workflow = yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            raise AssertionError(
                f'Убедитесь, что в файле `{workflow_file_name}` используется '
                'корректный YAML-синтаксис. При попытке чтения файла возникло '
                'исключение:\n'
                f'{exc.__class__.__name__}: {exc}'
            )
    assert workflow, (
        f'Убедитесь, что файл `{workflow_file_name}` в корневой директории '
        'проекта содержит настройку workflow проекта.'
    )


def test_requirements_location(backend_dir_info: tuple[Path, str]):
    backend_path, relative_backend_path = backend_dir_info
    requirements_file_name = 'requirements.txt'
    path_to_file = backend_path / requirements_file_name
    assert path_to_file.is_file(), (
        f'Убедитесь, что директория {relative_backend_path} содержит файл '
        f'зависимостей `{requirements_file_name}`.'
    )

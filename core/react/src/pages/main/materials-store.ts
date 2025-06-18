import { makeAutoObservable, runInAction, transaction } from 'mobx';
import api from './api';
// import { pluralize } from '../../utils/functions';


const MINIO_ERROR_EVENTS = {
    ONLOAD_FILE_TOO_BIG: 'onload.file-too-big',
    ONLOAD_UNKNOWN_ERROR: 'onload.unknown',

    ONERROR: 'onerror',
    ONABORT: 'onabort',

    UPLOAD_ONERROR: 'upload.onerror',
    UPLOAD_ONABORT: 'upload.onabort',
    UPLOAD_ONTIMEOUT: 'upload.ontimeout',
}

const FILE_MAX_SIZE = 100 * 1024 * 1024;


interface ILessonMaterial {
    id: number;
    size: number;
    is_safe: boolean;
    filename: string;
    extension: string;
    author_id: number;
}

interface IUploadModalFile {
    id: number;
    size: number;
    filename: string;
    extension: string;
}

interface IUpload {
    lesson_material: ILessonMaterial;
    upload_link: string;
    ttl_seconds: number;
    content_type: string;
}

interface IDownload {
    lesson_material: ILessonMaterial;
    download_link: string;
    ttl_seconds: number;
}

interface IDownoadAllFile {
    lesson_material: ILessonMaterial;
    download_link: string;
}

interface IDownloadAll {
    files: IDownoadAllFile[];
    ttl_seconds: number;
}

interface ISaveMaterials {
    lesson_materials: ILessonMaterial[];
    extra_check_material_ids: number[];
}

interface IFileState {
    loaded: boolean;
    progress: number;
}


class LessonMaterialsStore {
    isLoading_save: boolean = false;
    isLoading_downloadAll: boolean = false;

    uploadModal_isOpen: boolean = false;
    uploadModal_lessonMaterials: IUploadModalFile[] = [];

    resetConfirmationModal_isOpen: boolean = false;

    acceptExtensions: string[] = null;
    lessonMaterials: ILessonMaterial[] = [];
    lessonMaterialsCount: number = 0;

    private latestLoaderMaterialId: number = 0;
    uploadFileStates: Record<string, IFileState> = {};

    constructor() {
        makeAutoObservable(this);
    };

    initLessonMaterials = (lessonMaterials: unknown) => transaction(() => {
        this.lessonMaterials = lessonMaterials as ILessonMaterial[];
        this.lessonMaterialsCount = (Array.isArray(lessonMaterials) && lessonMaterials.length) || 0;
    })

    initAcceptExtensions = (acceptExtensions: unknown) => {
        this.acceptExtensions = acceptExtensions as string[];
    }

    openUploadModal = () => {
        this.uploadModal_isOpen = true;
    }

    closeUploadModal = () => {
        this.uploadModal_isOpen = false;
    }

    openResetConfirmationModal = () => transaction(() => {
        this.resetConfirmationModal_isOpen = true;
        this.uploadModal_isOpen = false;
    })

    closeResetConfirmationModal = () => transaction(() => {
        this.resetConfirmationModal_isOpen = false;
        this.uploadModal_isOpen = true;
    })

    resetModals = () => transaction(() => {
        this.uploadModal_isOpen = false;
        this.resetConfirmationModal_isOpen = false;
        this.uploadModal_lessonMaterials = [];
    })

    private generateUniqueLoaderMaterialId = () => {
        const loaderId = this.latestLoaderMaterialId + 1;
        this.latestLoaderMaterialId = this.latestLoaderMaterialId + 1;
        return `loader_${loaderId}`;
    }

    private uploadSingleFileToMinio = async (loaderMaterialId: string, link: string, file: File, contentType: string) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve({});
                } if (xhr.status === 413) {
                    reject({ xhr, status: xhr.status, eventName: MINIO_ERROR_EVENTS.ONLOAD_FILE_TOO_BIG });
                } else {
                    reject({ xhr, status: xhr.status, eventName: MINIO_ERROR_EVENTS.ONLOAD_UNKNOWN_ERROR });
                }
            };
            xhr.onerror = (event) => reject({ xhr, event, eventName: MINIO_ERROR_EVENTS.ONERROR });
            xhr.onabort = (event) => reject({ xhr, event, eventName: MINIO_ERROR_EVENTS.ONABORT });

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);

                    runInAction(() => {
                        const fileState = this.uploadFileStates[loaderMaterialId];

                        if (fileState !== null && fileState !== undefined) {
                            fileState.progress = progress;
                            this.uploadFileStates = { ...this.uploadFileStates, ...{ [loaderMaterialId]: fileState } };
                        }
                    });
                }
            };
            xhr.upload.onabort = (event) => reject({ xhr, event, eventName: MINIO_ERROR_EVENTS.UPLOAD_ONABORT });
            xhr.upload.onerror = (event) => reject({ xhr, event, eventName: MINIO_ERROR_EVENTS.UPLOAD_ONERROR });
            xhr.upload.ontimeout = (event) => reject({ xhr, event, eventName: MINIO_ERROR_EVENTS.UPLOAD_ONTIMEOUT });

            xhr.open('PUT', link);
            xhr.setRequestHeader('Content-Type', contentType);
            xhr.send(file);
        });
    }

    private handleMinioUpload = async (loaderMaterialId: string, lesson_material: ILessonMaterial, link: string, file: File, contentType: string) => {
        // lesson_material.id можно использовать для отображения конкретного лоадера
        // для N загружаемых парралельно файлов (массив файлов с состояниями)

        try {
            await this.uploadSingleFileToMinio(loaderMaterialId, link, file, contentType);
            runInAction(() => { this.uploadModal_lessonMaterials = [lesson_material, ...this.uploadModal_lessonMaterials] })
        } catch (error) {
            if (error && error.xhr) {
                const { xhr, event, status = '[Смотри описание в issue]', eventName } = error;
                console.error(`XHR status=${status} ошибка при попытке загрузки материала`, { error })

                switch (true) {
                    case eventName === MINIO_ERROR_EVENTS.ONLOAD_FILE_TOO_BIG:
                        // Ограничение на размер файла 100 МБ
                        // window.alertify.notify('Ошибка при загрузке файла: Максимальный размер файла - 100 МБ', 'error', 5);
                        break;
                    case eventName === MINIO_ERROR_EVENTS.UPLOAD_ONTIMEOUT:
                        // window.alertify.notify('Ошибка при загрузке файла: Превышено время ожидания', 'error', 5);
                        break;
                    case eventName === MINIO_ERROR_EVENTS.ONLOAD_UNKNOWN_ERROR:
                        // window.alertify.notify(`Ошибка при загрузке файла: Получен не 200 код ответа [${status}]`, 'error', 5);
                        break;
                    case [MINIO_ERROR_EVENTS.ONERROR, MINIO_ERROR_EVENTS.UPLOAD_ONERROR].includes(eventName):
                        // window.alertify.notify('Ошибка при загрузке файла: Ошибка во время передачи', 'error', 5);
                        break;
                    case [MINIO_ERROR_EVENTS.ONABORT, MINIO_ERROR_EVENTS.UPLOAD_ONABORT].includes(eventName):
                        // window.alertify.notify('Ошибка при загрузке файла: Потеряно соединение с сервером', 'error', 5);
                        break;
                    default:
                        // window.alertify.notify('При попытке загрузить материал произошла неизвестная ошибка. Попробуй позже', 'error', 5);
                        break;
                }

                return;
            }

            console.error('Неизвестная ошибка MinIO при попытке загрузки материала', { error });
            // window.alertify.notify('При попытке загрузить материал произошла неизвестная ошибка. Попробуй позже', 'error', 5);
        }
    }

    uploadSingleFile = async (lessonId: number, file: File) => {
        const url = `/materials/lesson_materials/${lessonId}/upload_url/`;
        const loaderMaterialId = this.generateUniqueLoaderMaterialId();

        if (!file?.name) {
            // window.alertify.notify('Файл не был приложен или у него отсутствует название', 'error', 5);
            return;
        }

        const { name: filename, size: filesize } = file || {};

        if (filesize > FILE_MAX_SIZE) {
            // Ограничение по умолчанию - 100 МБ
            // window.alertify.notify('Ошибка при получении ссылки на загрузку: Максимальный размер файла - 100 МБ', 'error', 5);
            return;
        }

        try {
            runInAction(() => { this.uploadFileStates = { ...this.uploadFileStates, [loaderMaterialId]: { progress: 0, loaded: false } }; });

            const response = await api.post(url, { filename: filename }) as IUpload;
            const { lesson_material, upload_link, content_type, ttl_seconds } = response;

            if (!lesson_material.id || !upload_link) {
                // Ссылка на загрузку успешно не получена
                return;
            }

            // Обработка ошибок MinIO внутри handleMinioUpload
            await this.handleMinioUpload(loaderMaterialId, lesson_material, upload_link, file, content_type);
        } catch (error) {
            if (!error?.response || !navigator.onLine) {
                // Обработка отсутствия сетевого соединения на клиенте
                console.error(`uploadSingleFile: online=${navigator.onLine}, ${error}`, { error });
                // window.alertify.notify('Нет соединения с интернетом, попробуй перезагрузить страницу', 'error', 5);
                return;
            }

            if (error.response.status >= 500) {
                // Обработка ошибок сервера
                // window.alertify.notify('Ошибка при получении ссылки на загрузку: Серверная ошибка, попробуй позже', 'error', 5);
                return;
            }

            if (error.filename && Array.isArray(error.filename)) {
                // Обработка ошибок валидации типов передаваемого файла
                // window.alertify.notify(error.filename[0], 'error', 5);
                return;
            }

            if (error.detail) {
                // Обработка ошибок валидации прав пользователя / доступности занятия / бурста
                // window.alertify.notify(error.detail, 'error', 5);
                return;
            }

            console.error('uploadSingleFile: Неизвестная ошибка при попытке загрузки материала', { error })
            // window.alertify.notify('Ошибка при получении ссылки на загрузку: Неизвестная ошибка, попробуй позже', 'error', 5);
        } finally {
            runInAction(() => { this.uploadFileStates = { ...this.uploadFileStates, [loaderMaterialId]: { progress: 100, loaded: true } }; });
        }
    }

    private downloadSingleFileFromMinio = (link: string) => {
        const tmpLink = document.createElement("a");
        tmpLink.style.display = 'none'
        tmpLink.download = "1";
        // tmpLink.target = "_blank";
        tmpLink.href = link;

        document.body.appendChild(tmpLink);

        tmpLink.click();
        tmpLink.remove();
    }

    downloadSingleFile = async (lessonId: number, materialId: number) => {
        const url = `/materials/lesson_materials/${lessonId}/${materialId}/download_url/`;

        try {
            const response = await api.post(url) as IDownload;
            const { lesson_material, download_link, ttl_seconds } = response;

            if (materialId === lesson_material.id && download_link) {
                // Ссылка на скачивание успешно получена
                this.downloadSingleFileFromMinio(download_link);
            }
        } catch (error) {
            if (!error?.response || !navigator.onLine) {
                // Обработка отсутствия сетевого соединения на клиенте
                console.error(`downloadSingleFile: online=${navigator.onLine}, ${error}`, { error });
                // window.alertify.notify('Нет соединения с интернетом, попробуй перезагрузить страницу', 'error', 5);
                return;
            }

            if (error.response.status >= 500) {
                // Обработка ошибок сервера
                // window.alertify.notify('При попытке скачать материал произошла серверная ошибка. Попробуй позже', 'error', 5);
                return;
            }

            if (error.detail) {
                // Обработка ошибок валидации
                // window.alertify.notify(error.detail, 'error', 5);
                return;
            }

            console.error('downloadSingleFile: Неизвестная ошибка при попытке скачивания материала', { error })
            // window.alertify.notify('При попытке скачать материал произошла неизвестная ошибка. Попробуй позже', 'error', 5);
        }
    }

    downloadAllFiles = async (lessonId: number) => {
        const url = `/materials/lesson_materials/${lessonId}/download_urls/`;

        try {
            runInAction(() => { this.isLoading_downloadAll = true; });

            const response = await api.post(url) as IDownloadAll;
            const { files, ttl_seconds } = response;

            if (Array.isArray(files) && files.length > 0) {
                // Ссылки на скачивание успешно получена
                files.forEach(({ download_link }) => { this.downloadSingleFileFromMinio(download_link); })
            }
        } catch (error) {
            if (!error?.response || !navigator.onLine) {
                // Обработка отсутствия сетевого соединения на клиенте
                console.error(`downloadSingleFile: online=${navigator.onLine}, ${error}`, { error });
                // window.alertify.notify('Нет соединения с интернетом, попробуй перезагрузить страницу', 'error', 5);
                return;
            }

            if (error.response.status >= 500) {
                // Обработка ошибок сервера
                // window.alertify.notify('При попытке скачать все материалы занятия произошла серверная ошибка. Попробуй позже', 'error', 5);
                return;
            }

            if (error.detail) {
                // Обработка ошибок валидации
                // window.alertify.notify(error.detail, 'error', 5);
                return;
            }

            console.error('downloadAllFiles: Неизвестная ошибка при попытке скачивания материалов занятия', { error })
            // window.alertify.notify('При попытке скачать материалы занятия произошла неизвестная ошибка. Попробуй позже', 'error', 5);
        } finally {
            runInAction(() => { this.isLoading_downloadAll = false; });
        }
    }

    saveUploadedFiles = async (lessonId: number) => {
        const url = `/materials/lesson_materials/${lessonId}/save/`;
        runInAction(() => { this.isLoading_save = true; });

        try {
            const lesson_material_ids = this.uploadModal_lessonMaterials.map((lm) => lm.id);
            const response = await api.post(url, { lesson_material_ids }) as ISaveMaterials;
            const { lesson_materials, extra_check_material_ids } = response;

            if (Array.isArray(lesson_materials) && lesson_materials.length > 0) {
                runInAction(() => { this.lessonMaterials = [...lesson_materials, ...this.lessonMaterials]; });
                // window.alertify.notify(`Успешно добавлено материалов к занятию: ${lesson_materials.length}`, 'success', 5);
            }

            if (Array.isArray(extra_check_material_ids) && extra_check_material_ids.length > 0) {
                // const pluralized = pluralize(extra_check_material_ids.length, 'материала', 'материалов', 'материалов');
                // const notify_msg = `Дополнительная проверка безопасности проводится для ${extra_check_material_ids.length}`;
                // window.alertify.notify(`${notify_msg} ${pluralized}`, 'warning', 5);
            }

            runInAction(() => { this.resetModals(); });
        } catch (error) {
            if (!error?.response || !navigator.onLine) {
                // Обработка отсутствия сетевого соединения на клиенте
                console.error(`saveUploadedFiles: online=${navigator.onLine}, ${error}`, { error });
                // window.alertify.notify('Нет соединения с интернетом, попробуй перезагрузить страницу', 'error', 5);
                return;
            }

            if (error.response.status >= 500) {
                // Обработка ошибок сервера
                // window.alertify.notify('При попытке сохранить материалы произошла серверная ошибка. Попробуй позже', 'error', 5);
                return;
            }

            if (error.detail) {
                // Обработка ошибок валидации
                // window.alertify.notify(error.detail, 'error', 5);
                return;
            }

            console.error('saveUploadedFiles: Неизвестная ошибка при попытке сохранения материалов', { error })
            // window.alertify.notify('При попытке сохранить материалы произошла неизвестная ошибка. Попробуй позже', 'error', 5);
        } finally {
            runInAction(() => { this.isLoading_save = false; });
        }
    }
}

export type { ILessonMaterial, IUploadModalFile };
export default new LessonMaterialsStore();

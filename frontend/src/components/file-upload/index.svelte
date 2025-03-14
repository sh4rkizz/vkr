<script lang="ts">
    import cookies from "browser-cookies";
    import { onMount } from "svelte";

    const { stepId } = $props();

    // Интерфейс для хранения состояния загрузки
    interface UploadState {
        progress: number;
        status: "idle" | "loading" | "success" | "error";
        errorMessage?: string;
    }

    // Состояние компонента
    let file: File | null = $state(null);
    let uploadState: UploadState = $state({ progress: 0, status: "idle" });

    // Обработчик выбора файла
    async function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;

        if (!target.files?.length) {
            return;
        }

        file = target.files[0];
        await uploadFile(file);
    }

    // Функция загрузки файла
    async function uploadFile(selectedFile: File) {
        try {
            // Получаем presigned URL от сервера
            const response = await fetch(`/attachments/${stepId}/presigned-url/`, {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.get("csrftoken"),
                },
                body: JSON.stringify({
                    filename: selectedFile.name,
                    contentType: selectedFile.type,
                }),
            });

            if (!response.ok) {
                throw new Error("Ошибка при получении presigned URL");
            }

            const { upload_url, content_type } = await response.json();

            // Начинаем загрузку файла в MinIO
            uploadState.status = "loading";

            const xhr = new XMLHttpRequest();
            xhr.open("PUT", upload_url, true);
            xhr.setRequestHeader("Content-Type", content_type);

            // Отслеживаем прогресс загрузки
            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round(
                        (event.loaded / event.total) * 100,
                    );
                    uploadState.progress = progress;
                }
            });

            xhr.onload = () => {
                if (xhr.status === 200) {
                    uploadState.status = "success";
                } else if (xhr.status === 413) {
                    throw new Error(`Ошибка загрузки: ${xhr.status}: ${xhr.statusText}`);
                } else {
                    throw new Error(`Ошибка загрузки: ${xhr.status}: ${xhr.statusText}`);
                }
            };

            xhr.onerror = () => {
                throw new Error("Ошибка сети при загрузке файла");
            };

            await new Promise<void>((resolve, reject) => {
                xhr.send(selectedFile);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve();
                        } else {
                            reject(
                                new Error(`Ошибка загрузки: ${xhr.status}: ${xhr.statusText}`),
                            );
                        }
                    }
                };
            });
        } catch (error) {
            uploadState.status = "error";
            uploadState.errorMessage =
                error instanceof Error ? error.message : "Неизвестная ошибка";
        }
    }

    // Сброс состояния при размонтировании компонента
    onMount(() => {
        return () => {
            uploadState = { progress: 0, status: "idle" };
        };
    });
</script>

<div class="upload-form">
    <div class="form-group">
        <label>
            Выберите файл для загрузки:
            <input
                type="file"
                accept="*/*"
                onchange={handleFileSelect}
                class="file-input"
            />
        </label>

        {#if uploadState.status === "loading"}
            <div class="progress-container">
                <div
                    class="progress-bar"
                    style={`width: ${uploadState.progress}%`}
                ></div>
                <span class="progress-text">{uploadState.progress}%</span>
            </div>
        {/if}

        {#if uploadState.status === "error"}
            <div class="error-message">
                {uploadState.errorMessage}
            </div>
        {/if}

        {#if uploadState.status === "success"}
            <div class="success-message">Файл успешно загружен!</div>
        {/if}
    </div>
</div>

<style>
    .upload-form {
        max-width: 500px;
        margin: 20px auto;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .file-input {
        margin-top: 8px;
    }

    .progress-container {
        width: 100%;
        height: 20px;
        background-color: #f0f0f0;
        border-radius: 10px;
        overflow: hidden;
    }

    .progress-bar {
        height: 100%;
        background-color: #2196f3;
        transition: width 0.3s ease;
    }

    .error-message {
        color: #ff4444;
        padding: 10px;
        border-radius: 4px;
        background-color: rgba(255, 68, 68, 0.1);
    }

    .success-message {
        color: #44ff44;
        padding: 10px;
        border-radius: 4px;
        background-color: rgba(68, 255, 68, 0.1);
    }
</style>

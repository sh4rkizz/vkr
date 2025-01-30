const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log('POST Login', { ...data });
}

return (
    <form onSubmit={handleSubmit} className={style.baseForm}>
        <div className={style.formRow}>
            <label>
                <input
                    type="text" name="username"
                    value={data.username}
                    onInput={handleInput}
                />
            </label>

            <div className={style.error}>{errors.username}</div>
        </div>

        <div className={style.formRow}>
            <label>
                <input
                    type="password" name="password"
                    value={data.password} onInput={handleInput}
                />
            </label>

            <div className={style.error}>{errors.password}</div>
        </div>

        <div className={style.formRow}>
            <div className={style.error}>{ratelimit || __all__ || non_field_errors}</div>
            <button className="blue" type="submit">Войти</button>
        </div>
    </form>
);
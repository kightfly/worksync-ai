/**
 * Phase 3 护栏用最小ログイン画面プレースホルダ。
 * 本格実装は 4p12s ⑧ TASK で TDD 推進すること。
 */
export function App() {
  return (
    <main>
      <h1>勤怠・タスク管理</h1>
      <section aria-label="ログイン">
        <h2>ログイン</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label>
            メールアドレス
            <input name="email" type="email" required autoComplete="username" />
          </label>
          <label>
            パスワード
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
            />
          </label>
          <button type="submit">ログイン</button>
        </form>
      </section>
    </main>
  );
}

import { h, render } from "preact";
import { useState, useEffect } from "preact/hooks";
import { html } from "htm/preact";
import { config } from "../config.js";
import { GettoExampleCredential } from "../credential.js";
import { GettoExamplePages, Breadcrumbs } from "./pages.ts";
import { setDocumentTitle, Menu, BreadcrumbLinks, Footer } from "./layout.ts";

(() => {
  const [categories, breadcrumbs] = GettoExamplePages({
    current: location.pathname,
    version: config.version,
  });
  const credential = GettoExampleCredential();

  const app = h("main", { class: "layout" }, [
    html`<${Page} breadcrumbs=${breadcrumbs}/>`,
    html`<${Menu} breadcrumbs=${breadcrumbs} categories=${categories} credential=${credential} version=${config.version}/>`,
  ]);
  render(app, document.body);
})();

type Props = {
  breadcrumbs: Breadcrumbs,
}

function Page(props: Props) {
  const [state, _] = useState("STATIC-STATE");

  useEffect(() => {
    setDocumentTitle("認証・認可");
  }, [state]);

  return html`
    <article class="layout__main">
      <header class="main__header">
        <h1 class="main__title">認証・認可</h1>
        <${BreadcrumbLinks} breadcrumbs=${props.breadcrumbs}/>
      </header>
      <article class="main__body">
        <section class="container">
          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">セキュアな認証のために</h2>
              </header>
              <section class="box__body paragraph">
                <p>認証情報を署名して送信</p>
                <p>認証情報はセキュアな方法で送信</p>
                <div class="vertical vertical_small"></div>
                <p>認証情報 :</p>
                <ul>
                  <li><small><i class="lnir lnir-chevron-right"></i></small> 有効期限延長用チケットトークン</li>
                  <li><small><i class="lnir lnir-chevron-right"></i></small> API 認証用トークン</li>
                  <li><small><i class="lnir lnir-chevron-right"></i></small> コンテンツ認証用トークン</li>
                </ul>
                <div class="vertical vertical_small"></div>
                <p>管理者は以下を管理できる</p>
                <ul>
                  <li><small><i class="lnir lnir-chevron-right"></i></small> ユーザーのログイン可否 <span class="label label_pending">あとで</span></li>
                </ul>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">ストレスなく使用するために</h2>
              </header>
              <section class="box__body paragraph">
                <p>有効期限を延長できる</p>
                <p>API トークン、コンテンツトークンの検証は署名の検証のみ</p>
                <small><p>（認証サーバーへの通信を発生させない）</p></small>
                <p>パスワードを再設定できる</p>
                <small><p>（パスワードを忘れた場合）</p></small>
                <div class="vertical vertical_small"></div>
                <p>管理者なら以下を管理できる</p>
                <ul>
                  <li><small><i class="lnir lnir-chevron-right"></i></small> 他のユーザーのログインID <span class="label label_pending">あとで</span></li>
                  <li><small><i class="lnir lnir-chevron-right"></i></small> 他のユーザーのパスワード <span class="label label_pending">あとで</span></li>
                  <li><small><i class="lnir lnir-chevron-right"></i></small> 他のユーザーの web 証明書 <span class="label label_pending">あとで</span></li>
                </ul>
              </section>
            </div>
          </section>

          <section class="box box_double">
            <div>
              <header class="box__header">
                <h2 class="box__title">判明しているダメな点</h2>
              </header>
              <section class="box__body paragraph">
                <p><i class="lnir lnir-close"></i> チケットの有効期限切れの前にチケットを無効化できない</p>
                <small><p>（最大延長期間を操作することで再認証を促すことは可能）</p></small>
                <p><i class="lnir lnir-close"></i> チケットが漏れた場合、有効期限延長を続けることで最大期間アクセス可能</p>
                <small><p>（これをするためには cookie の奪取とメモリの解析を行う必要があるので、事実上不可能としていいかな）</p></small>
                <p><i class="lnir lnir-close"></i> http を使用することを想定</p>
                <small><p>（http 以外の方式で通信する必要が出たときに考える）</p></small>
                <p><i class="lnir lnir-close"></i> cookie を使用するため別なタブで別ユーザーとしてログインできない</p>
                <small><p>（アプリケーションを別ユーザーでログインする必要がある設計にしないことで対応）</p></small>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">前提とするクライアント</h2>
              </header>
              <section class="box__body paragraph">
                <p><i class="lnir lnir-display"></i> http クライアント</p>
                <small><p>（ブラウザ、スマホアプリ）</p></small>
                <p><i class="lnir lnir-envelope"></i> テキストメッセージクライアント</p>
                <small><p>（メール、slack）</p></small>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">詳細</h2>
              </header>
              <section class="box__body paragraph">
                <p>API トークン、コンテンツトークンの有効期限を短く設定</p>
                <small><p>（漏れた場合でもすぐ使用できなくなるように）</p></small>
                <p>有効期限延長リクエストを検証</p>
                <small><p>（リクエストが発行時と一致しなければ延長しない）</p></small>
                <p>チケットの最大延長期間を設定</p>
                <small><p>（永遠に延長することはできないように）</p></small>
                <p>チケットの最大延長期限を管理</p>
                <small><p>（必要なくなったユーザーを認証できなくする）</p></small>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">認証イベント</h2>
              </header>
              <section class="box__body paragraph">
                <p>認証イベントを記録</p>
                <small><p>（問題のある認証を検出できるように）</p></small>
                <p>認証イベントの通知</p>
                <small><p>（パスワード再設定の案内）</p></small>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">エラー</h2>
              </header>
              <section class="box__body paragraph">
                <p>ユーザーの操作で復帰できるエラーの場合、エラー内容をフィードバック</p>
                <p>そうでないエラーの場合、内容のフィードバックはせずにログに記録</p>
              </section>
            </div>
          </section>
        </section>

        <div class="vertical vertical_medium"></div>

        <section class="container">
          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">継続認証</h2>
              </header>
              <section class="box__body paragraph">
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-right"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>チケットトークン</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>チケットトークン検証 <span class="label label_alert">検証失敗</span></li>
                      <li>チケット有効期限検証 <span class="label label_alert">検証失敗</span></li>
                      <li>チケット有効期限延長</li>
                      <li>チケットトークン発行</li>
                      <li>API トークン発行</li>
                      <li>コンテンツトークン発行</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-left"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li><span class="label label_success">認証情報</span>新チケットトークン</li>
                      <li><span class="label label_success">認証情報</span>API トークン / 権限</li>
                      <li><span class="label label_success">認証情報</span>コンテンツトークン</li>
                    </ul>
                  </dd>
                </dl>

                <hr/>

                <p>チケットトークン・有効期限の検証失敗で認証情報は失効</p>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">ログアウト</h2>
              </header>
              <section class="box__body paragraph">
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-right"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>チケットトークン</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>チケットトークン検証 <span class="label label_alert">検証失敗</span></li>
                      <li>チケット有効期限検証 <span class="label label_alert">検証失敗</span></li>
                      <li>チケット有効期限無効化</li>
                    </ul>
                  </dd>
                </dl>

                <hr/>

                <p>ログアウトで認証情報は失効</p>
              </section>
            </div>
          </section>
        </section>

        <section class="container">
          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">パスワードログイン</h2>
              </header>
              <section class="box__body paragraph">
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-right"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>ログインID</li>
                      <li>パスワード</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>パスワード検証 <span class="label label_alert">検証失敗</span></li>
                      <li>チケットトークン発行</li>
                      <li>API トークン発行</li>
                      <li>コンテンツトークン発行</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-left"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li><span class="label label_success">認証情報</span>チケットトークン</li>
                      <li><span class="label label_success">認証情報</span>API トークン / 権限</li>
                      <li><span class="label label_success">認証情報</span>コンテンツトークン</li>
                    </ul>
                  </dd>
                </dl>

                <hr/>

                <p>空のパスワードでは認証できない</p>
                <p>長すぎるパスワードでは認証できない</p>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">パスワード変更</h2>
              </header>
              <section class="box__body paragraph">
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-right"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>チケットトークン</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>チケットトークン検証 <span class="label label_alert">検証失敗</span></li>
                      <li>チケット有効期限検証 <span class="label label_alert">検証失敗</span></li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-left"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>ログインID</li>
                      <small><li>（パスワードを変更しようとしているログインID を表示）</li></small>
                    </ul>
                  </dd>
                </dl>

                <hr/>

                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-right"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>チケット</li>
                      <li>ログインID</li>
                      <li>旧パスワード</li>
                      <li>新パスワード</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>チケットトークン検証 <span class="label label_alert">検証失敗</span></li>
                      <li>チケット有効期限検証 <span class="label label_alert">検証失敗</span></li>
                      <li>旧パスワード検証 <span class="label label_alert">検証失敗</span></li>
                      <li>パスワード変更 <span class="label label_alert">変更失敗</span></li>
                    </ul>
                  </dd>
                </dl>

                <hr/>

                <p>チケットトークン・有効期限の検証失敗で認証情報は失効</p>
                <p>旧パスワードは使用できなくなる</p>
                <p>空のパスワードには変更できない</p>
                <p>長すぎるパスワードには変更できない</p>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">パスワード再設定</h2>
              </header>
              <section class="box__body paragraph">
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-right"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>ログインID</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>メッセージの宛先取得 <span class="label label_alert">宛先不明</span></li>
                      <small><li>（ログインID にメッセージの宛先が登録されているか）</li></small>
                      <li>リセットセッション開始</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-left"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>リセットセッションID</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-envelope"></i> メール <i class="lnir lnir-arrow-left"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>リセットトークン</li>
                    </ul>
                  </dd>
                </dl>

                <hr/>

                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-right"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>リセットセッションID</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>リセットステータスを取得 <span class="label label_alert">登録なし</span></li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-left"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>リセットステータス</li>
                      <small><li>（メールの送信状態をフィードバック）</li></small>
                    </ul>
                  </dd>
                </dl>

                <hr/>

                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-envelope"></i> メール <i class="lnir lnir-arrow-right"></i> <i class="lnir lnir-display"></i> ブラウザ</dt>
                  <dd class="form__field">
                    <ul>
                      <li>リセットトークン</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-right"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>リセットトークン</li>
                      <li>ログインID </li>
                      <small><li>（セッション開始した時点のログインID を使用）</li></small>
                      <li>パスワード</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li>リセットトークン検証 <span class="label label_alert">検証失敗</span></li>
                      <li>ログインID 検証 <span class="label label_alert">検証失敗</span></li>
                      <small><li>（セッション開始した時点のログインID と一致するか）</li></small>
                      <li>パスワード登録 <span class="label label_alert">登録失敗</span></li>
                      <li>チケット発行</li>
                      <li>API トークン発行</li>
                      <li>コンテンツトークン発行</li>
                    </ul>
                  </dd>
                </dl>
                <dl class="form">
                  <dt class="form__header"><i class="lnir lnir-display"></i> ブラウザ <i class="lnir lnir-arrow-left"></i> <i class="lnir lnir-cog"></i> システム</dt>
                  <dd class="form__field">
                    <ul>
                      <li><span class="label label_success">認証情報</span>チケットトークン</li>
                      <li><span class="label label_success">認証情報</span>API トークン / 権限</li>
                      <li><span class="label label_success">認証情報</span>コンテンツトークン</li>
                    </ul>
                  </dd>
                </dl>

                <hr/>

                <p>旧パスワードは使用できなくなる</p>
                <p>リセット完了でセッションは失効</p>
              </section>
            </div>
          </section>
        </section>

        <section class="container">
          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title"><span class="label label_pending">あとで</span>web 証明書認証</h2>
              </header>
              <section class="box__body paragraph">
                <p>web 証明書の検証</p>
                <p>チケットを新規発行</p>
                <p>API トークンを発行</p>
                <p>コンテンツトークンを発行</p>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title"><span class="label label_pending">あとで</span>web 証明書登録</h2>
              </header>
              <section class="box__body paragraph">
                <p>チケットの検証</p>
                <p>パスワードの検証</p>
                <p>新 web 証明書の登録</p>
                <small><p>以前の証明書は使用できなくなる</p></small>
              </section>
            </div>
          </section>
        </section>

        <section class="container">
          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title"><span class="label label_pending">あとで</span>ユーザー登録 <span class="label label_info">管理者</span></h2>
              </header>
              <section class="box__body paragraph">
                <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>ユーザーの登録</p>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title"><span class="label label_pending">あとで</span>特定ユーザーログインID 変更 <span class="label label_info">管理者</span></h2>
              </header>
              <section class="box__body paragraph">
                <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>特定ユーザーのログインIDを変更</p>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title"><span class="label label_pending">あとで</span>特定ユーザーパスワード変更 <span class="label label_info">管理者</span></h2>
              </header>
              <section class="box__body paragraph">
                <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>特定ユーザーのパスワードを変更</p>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title"><span class="label label_pending">あとで</span>特定ユーザーパスワード削除 <span class="label label_info">管理者</span></h2>
              </header>
              <section class="box__body paragraph">
                <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>特定ユーザーのパスワードを削除</p>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title"><span class="label label_pending">あとで</span>特定ユーザー無効化 <span class="label label_info">管理者</span></h2>
              </header>
              <section class="box__body paragraph">
                <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>特定ユーザーの全チケットの最大延長期間を削除</p>
              </section>
            </div>
          </section>
        </section>

        <div class="vertical vertical_medium"></div>

        <section class="container">

          <section class="box box_double">
            <div>
              <header class="box__header">
                <h2 class="box__title">認証情報</h2>
              </header>
              <section class="box__body paragraph">

                <dl class="form">
                  <dt class="form__header">ACTION</dt>
                  <dd class="form__field">
                    <ul>
                      <li>チケットトークン検証</li>
                      <li>チケットトークン発行</li>
                      <li>APIトークン発行</li>
                      <li>コンテンツトークン発行</li>
                    </ul>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">チケットトークン</dt>
                  <dd class="form__field">
                    <p>API トークン・コンテンツトークンの有効期限延長に使用するチケット</p>
                    <p>適切な方法で署名する</p>
                    <p>適切な方法で署名を検証する</p>
                    <p>チケットトークンの有効期限は1週間程度とする</p>
                    <small><p>(金曜に業務終了してから月曜に使用開始するときに有効期限が切れないように）</p></small>
                    <p>チケットトークンをクライアントに送信する際は特にセキュアな方法を使用する</p>
                    <small><p>(secure, http only な cookie を想定）</p></small>

                    <div class="vertical vertical_small"></div>

                    <p>トークンには以下のデータを含める</p>
                    <ul>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> Nonce</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> ユーザー</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> 有効期限</li>
                    </ul>

                    <div class="vertical vertical_small"></div>

                    <p>Nonce は別途クライアントに送信し、認証時に再送させる</p>
                    <p>Nonce がトークンのものと異なる場合は認証失敗とし、認証情報を失効させる</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">APIトークン</dt>
                  <dd class="form__field">
                    <p>API サーバーを使用するために必要な認証情報</p>
                    <p>適切な方法で署名する</p>
                    <p>署名の検証は API サーバーで行う</p>
                    <small><p>(検証に必要な鍵情報は API サーバーに提供する）</p></small>
                    <p>API トークンの有効期限は5分程度とする</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">コンテンツトークン</dt>
                  <dd class="form__field">
                    <p>プライベートコンテンツにアクセスするために必要な認証情報</p>
                    <p>適切な方法で署名する</p>
                    <p>署名の検証はコンテンツサーバーで行う</p>
                    <p>コンテンツトークンの有効期限は API トークンと同じ</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">チケット最大延長期間</dt>
                  <dd class="form__field">
                    <p>リクエスト時刻から既定の時間だけ延長が可能</p>
                    <p>認証の方法によって、異なる延長期間を設定</p>
                    <small><p>(パスワードなら短め、Web 証明書認証なら長めを想定）</p></small>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">チケット有効期限</dt>
                  <dd class="form__field">
                    <p>リクエスト時刻から既定の時間だけ有効</p>
                    <p>認証の方法によらず、有効期限は一定</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">トークン有効期限</dt>
                  <dd class="form__field">
                    <p>リクエスト時刻から既定の時間だけ有効</p>
                    <p>認証の方法によらず、有効期限は一定</p>
                    <p>APIトークン・コンテンツトークンはそれぞれのサーバーに指定される方法で送信するので、漏洩した際の影響を小さくするため短い有効期限を設定する</p>
                  </dd>
                </dl>

              </section>
            </div>
          </section>

          <section class="box box_double">
            <div>
              <header class="box__header">
                <h2 class="box__title">チケット</h2>
              </header>
              <section class="box__body paragraph">

                <dl class="form">
                  <dt class="form__header">ACTION</dt>
                  <dd class="form__field">
                    <ul>
                      <li>チケット登録</li>
                      <li>チケット検証</li>
                      <li>チケット有効期限延長</li>
                      <li>チケット無効化</li>
                    </ul>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">チケットデータ保管</dt>
                  <dd class="form__field">
                    <p>以下のデータをデータベースに保管</p>
                    <ul>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> ユーザー</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> 有効期限</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> 最大延長期間</li>
                    </ul>

                    <div class="vertical vertical_small"></div>

                    <p>ユーザーについてチケットトークンとデータベースが一致することを検証</p>
                    <p>有効期限はデータベースに保管されたものを使用して検証</p>
                    <p>検証が失敗した場合は認証情報を失効させる</p>
                    <p>チケットの無効化はデータベースの有効期限・最大延長期間を無効化</p>
                  </dd>
                </dl>

              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">ユーザー</h2>
              </header>
              <section class="box__body paragraph">

                <dl class="form">
                  <dt class="form__header">ACTION</dt>
                  <dd class="form__field">
                    <ul>
                      <li>ログインID取得</li>
                      <li>ユーザーID取得</li>
                    </ul>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">ユーザー</dt>
                  <dd class="form__field">
                    <p>ユーザーID・ログインIDを持つ</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">ユーザーID</dt>
                  <dd class="form__field">
                    <p>機械的にユーザーを識別する</p>
                    <p>全ユーザーの間で一意</p>
                    <p>予測不可能な文字列</p>
                    <p>登録時に生成して割り当て</p>
                    <p>変更されない</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">ログインID</dt>
                  <dd class="form__field">
                    <p>ログインするのに使用する</p>
                    <p>全ユーザーの間で一意</p>
                    <p>ユーザーの都合で変更可能</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">ユーザーID取得</dt>
                  <dd class="form__field">
                    <p>ログインIDからユーザーIDを取得</p>
                    <p>登録されていない場合は取得失敗</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">ログインID取得</dt>
                  <dd class="form__field">
                    <p>チケットトークンのユーザーからログインIDを取得</p>
                    <p>基本取得に失敗することはない</p>
                  </dd>
                </dl>

              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">パスワード</h2>
              </header>
              <section class="box__body paragraph">

                <dl class="form">
                  <dt class="form__header">ACTION</dt>
                  <dd class="form__field">
                    <ul>
                      <li>パスワード検証</li>
                      <li>パスワード変更</li>
                    </ul>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">入力パスワード</dt>
                  <dd class="form__field">
                    <p>ユーザーが入力したパスワード</p>
                    <p>メモリ以外に保管してはならない</p>
                    <p>空のパスワードは無効</p>
                    <p>長いパスワードは無効</p>
                    <small><p>（bcrypt を想定しているので、72バイト以上は無効）</p></small>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">ハッシュ化パスワード</dt>
                  <dd class="form__field">
                    <p>ユーザーが入力したパスワードにハッシュ関数を適用した文字列</p>
                    <p>データベースに保管する</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">パスワード検証</dt>
                  <dd class="form__field">
                    <p>入力パスワードが一致するかはハッシュ関数を使用して検証</p>
                    <small><p>（ハッシュ関数を適用して文字列一致するのではない）</p></small>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">パスワード変更</dt>
                  <dd class="form__field">
                    <p>新しいパスワードに変更</p>
                    <p>古いパスワードは使用不可能になる</p>
                  </dd>
                </dl>

              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">パスワードリセット</h2>
              </header>
              <section class="box__body paragraph">

                <dl class="form">
                  <dt class="form__header">ACTION</dt>
                  <dd class="form__field">
                    <ul>
                      <li>セッション生成</li>
                      <li>トークン送信 Job 生成</li>
                      <li>トークン送信</li>
                      <li>ステータス取得</li>
                      <li>トークン検証</li>
                      <li>セッション完了</li>
                    </ul>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">リセットセッション</dt>
                  <dd class="form__field">
                    <p>パスワードがわからなくなったときにリセットを可能にする</p>
                    <p>有効期限は1時間程度を想定</p>
                    <small><p>（メッセージクライアントが遅延することを見込んでおく）</p></small>
                    <p>パスワードのリセットが終わったらセッションは完了</p>
                    <p>完了したセッションではパスワードはリセットできない</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">セッションID</dt>
                  <dd class="form__field">
                    <p>セッションを識別する</p>
                    <p>全セッションの間で一意</p>
                    <p>予測不可能な文字列</p>
                    <p>生成時に生成して割り当て</p>
                    <p>変更されない</p>
                    <p>セッションを開始したクライアントに返信</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">トークン</dt>
                  <dd class="form__field">
                    <p>パスワードリセットの検証に使用</p>
                    <p>全セッションの間で一意</p>
                    <p>予測不可能な文字列</p>
                    <p>生成時に生成して割り当て</p>
                    <p>変更されない</p>
                    <p>あらかじめユーザーに割り当てられたメッセージクライアントに送信</p>
                    <small><p>（セッションを開始したクライアントには直接送信しない）</p></small>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">有効期限</dt>
                  <dd class="form__field">
                    <p>リクエスト時刻から既定の時間だけ有効</p>
                    <p>宛先によらず、有効期限は一定</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">セッションデータ</dt>
                  <dd class="form__field">
                    <p>以下のデータを含む</p>
                    <ul>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> ユーザー</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> リセット時ログインID</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> リクエスト時刻</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> 有効期限</li>
                    </ul>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">宛先</dt>
                  <dd class="form__field">
                    <p>以下の種類を想定</p>
                    <ul>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> ログメッセージに出力</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> Slack Channel に送信</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> メールアドレスに送信</li>
                    </ul>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">ステータス</dt>
                  <dd class="form__field">
                    <p>メッセージの送信状態の確認に使用</p>
                    <ul>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> 待機中 : 作成時刻</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> 送信中 : 処理開始時刻</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> 完了 : 完了時刻</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> 失敗 : 失敗時刻・理由</li>
                    </ul>
                  </dd>
                </dl>

              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">リクエスト</h2>
              </header>
              <section class="box__body paragraph">
                <dl class="form">
                  <dt class="form__header">リクエスト情報</dt>
                  <dd class="form__field">
                    <p>以下のデータを含む</p>
                    <ul>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> リクエスト時刻</li>
                      <li><small><i class="lnir lnir-chevron-right"></i></small> 経路情報（リモートIP）</li>
                    </ul>

                    <div class="vertical vertical_small"></div>

                    <p>アプリケーションログに記録する</p>
                    <p>http クライアントを想定しているのでこのデータになっている</p>
                  </dd>
                </dl>
              </section>
            </div>
          </section>

        </section>
      </article>
      <${Footer}/>
    </article>
  `;
};

/**
 * kaimon 個別相談データ取得API
 * =============================================
 * 【使い方】
 * 1. このコードを全コピーする
 * 2. スプレッドシートのメニュー「拡張機能」→「Apps Script」を開く
 * 3. 既存のコードを全て削除し、このコードを貼り付ける
 * 4. 「デプロイ」→「新しいデプロイ」をクリック
 * 5. 種類：「ウェブアプリ」を選択
 * 6. 実行ユーザー：「自分（自分のメールアドレス）」
 * 7. アクセス権限：「全員」
 * 8. 「デプロイ」をクリック → 権限を許可
 * 9. 表示された「ウェブアプリURL」をコピー
 * 10. 分析ツールの「設定」ボタンからURLを入力・保存
 * =============================================
 */

function doGet(e) {
  try {
    const SPREADSHEET_ID = '1jdfpZdQcCCZa2A1-cCKBL9yxWUKJ3O7CyEQbQ71Jljc';
    const TARGET_GID = 1497922169;

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // gidでシートを特定
    const sheets = ss.getSheets();
    let sheet = null;
    for (const s of sheets) {
      if (s.getSheetId() === TARGET_GID) {
        sheet = s;
        break;
      }
    }
    // 見つからなければ最初のシートを使用
    if (!sheet) sheet = ss.getSheets()[0];

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return jsonResponse([]);
    }

    const headers = data[0].map(h => h.toString().trim());

    const rows = data.slice(1)
      .filter(row => row.some(cell => cell !== '')) // 空行を除外
      .map(row => {
        const obj = {};
        headers.forEach((header, i) => {
          let value = row[i];
          // Date型を文字列に変換
          if (value instanceof Date) {
            value = Utilities.formatDate(value, 'Asia/Tokyo', 'yyyy-MM-dd');
          }
          obj[header] = (value !== null && value !== undefined) ? String(value) : '';
        });
        return obj;
      });

    return jsonResponse(rows);

  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function jsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

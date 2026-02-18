import React from "react";
import { FaEye, FaInbox, FaPrint } from "react-icons/fa";
import StatusPill from "@/Components/Orders/Editora/StatusPill";
import { formatEUR } from "@/Components/Orders/Editora/utils";

const handlePrint = (order) => {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    console.error("A janela de impressão não foi aberta (pop-up bloqueado?).");
    return;
  }

  const LOGO_URL = "/images/Papelock_logo.png";
  const STORE_NAME = "Papelock";
  const STORE_ADDR = "Rua X, 000 - 0000-000 Cidade";
  const STORE_PHONE = "+351 9xx xxx xxx";
  const STORE_EMAIL = "geral@papelix.pt";
  const STORE_NIF = "NIF: 123456789";

  const esc = (v) =>
    String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const lines = Array.isArray(order?.lines) ? order.lines : [];

  const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const formatEURLocal = (v) => {
    const n = toNumber(v);
    try {
      return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
    } catch {
      return `${n.toFixed(2)} €`;
    }
  };

  // ⚠️ No teu payload atual, cada linha tem: title, isbn, qty_ordered, qty_received

  const getUnitPrice = (item) => toNumber(item?.unit_price ?? item?.price ?? 0);

  const rowsHtml = lines
    .map((item) => {
      const title = esc(item?.title ?? "—");
      const isbn = esc(item?.isbn ?? "—");
      const qty = toNumber(item?.qty_ordered ?? 0);
      const unit = getUnitPrice(item);
      const sub = unit * qty;

      return `
        <tr>
          <td class="td">
            <div class="title">${title}</div>
            <div class="muted">ISBN: ${isbn}</div>
          </td>
          <td class="td center">${qty}</td>
          <td class="td right">${formatEURLocal(unit)}</td>
          <td class="td right">${formatEURLocal(sub)}</td>
        </tr>
      `;
    })
    .join("");

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Encomenda ${esc(order?.number)}</title>
        <style>
          :root {
            --text: #111827;
            --muted: #6B7280;
            --border: #E5E7EB;
            --soft: #F9FAFB;
          }

          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: var(--text);
            background: white;
          }

          .page {
            padding: 28px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            padding-bottom: 16px;
            border-bottom: 2px solid var(--border);
            margin-bottom: 18px;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .logo {
            height: 44px;
            width: auto;
            object-fit: contain;
          }

          .store {
            font-size: 12px;
            line-height: 1.4;
            color: var(--muted);
          }

          .store strong {
            color: var(--text);
            font-size: 13px;
          }

          .doc-title {
            text-align: right;
          }

          .doc-title h1 {
            margin: 0;
            font-size: 18px;
            font-weight: 800;
          }
          .doc-title .sub {
            margin-top: 6px;
            font-size: 12px;
            color: var(--muted);
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 18px;
          }

          .card {
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 12px 14px;
            background: var(--soft);
          }

          .row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            font-size: 12px;
            margin: 6px 0;
          }
          .row .k { color: var(--muted); }
          .row .v { font-weight: 700; color: var(--text); text-align: right; }

          .notes {
            margin-top: 8px;
            font-size: 12px;
            color: var(--text);
            white-space: pre-wrap;
          }
          .notes .k { color: var(--muted); font-weight: 700; display:block; margin-bottom: 6px; }

          table {
            width: 100%;
            border-collapse: collapse;
            overflow: hidden;
            border: 1px solid var(--border);
            border-radius: 10px;
          }

          thead th {
            background: #111827;
            color: white;
            font-size: 12px;
            padding: 10px 12px;
            text-align: left;
          }

          .td {
            border-top: 1px solid var(--border);
            padding: 10px 12px;
            font-size: 12px;
            vertical-align: top;
          }

          .title {
            font-weight: 800;
            margin-bottom: 3px;
          }

          .muted { color: var(--muted); font-size: 11px; }
          .right { text-align: right; }
          .center { text-align: center; }

          .summary {
            margin-top: 14px;
            display: flex;
            justify-content: flex-end;
          }

          .summary-box {
            min-width: 260px;
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 12px 14px;
            background: var(--soft);
          }

          .total {
            font-size: 14px;
            font-weight: 900;
          }

          .footer {
            margin-top: 18px;
            padding-top: 12px;
            border-top: 1px solid var(--border);
            font-size: 11px;
            color: var(--muted);
            display: flex;
            justify-content: space-between;
            gap: 10px;
          }

          @media print {
            .page { padding: 0; }
            body { margin: 0; }
            @page { margin: 12mm; }
          }
        </style>
      </head>

      <body>
        <div class="page">
          <div class="header">
            <div class="brand">
              <img class="logo" src="${esc(LOGO_URL)}" alt="Logo" onerror="this.style.display='none'" />
              <div class="store">
                <strong>${esc(STORE_NAME)}</strong><br/>
                ${esc(STORE_ADDR)}<br/>
                ${esc(STORE_PHONE)} · ${esc(STORE_EMAIL)}<br/>
                ${esc(STORE_NIF)}
              </div>
            </div>

            <div class="doc-title">
              <h1>Encomenda à Editora</h1>
              <div class="sub">Documento gerado em: ${esc(new Date().toLocaleString("pt-PT"))}</div>
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="row"><span class="k">Nº Encomenda</span><span class="v">${esc(order?.number ?? "—")}</span></div>
              <div class="row"><span class="k">Editora</span><span class="v">${esc(order?.publisher_name ?? "—")}</span></div>
              <div class="row"><span class="k">Status</span><span class="v">${esc(order?.status ?? "—")}</span></div>
            </div>

            <div class="card">
              <div class="row"><span class="k">Data Pedido</span><span class="v">${esc(order?.requested_at ?? "—")}</span></div>
              <div class="row"><span class="k">Entrega Prevista</span><span class="v">${esc(order?.expected_at ?? "—")}</span></div>
              <div class="row"><span class="k">Total</span><span class="v">${formatEURLocal(order?.total ?? 0)}</span></div>
            </div>
          </div>

          <div class="card">
            <span class="k muted" style="font-weight:800;">Observações</span>
            <div class="notes">${esc(order?.notes ?? "—")}</div>
          </div>

          <div style="height: 14px"></div>

          <table>
            <thead>
              <tr>
                <th>Livro</th>
                <th style="width:90px; text-align:center;">Qtd</th>
                <th style="width:130px; text-align:right;">Preço</th>
                <th style="width:130px; text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${
                lines.length === 0
                  ? `<tr><td class="td" colspan="4"><span class="muted">Sem itens.</span></td></tr>`
                  : rowsHtml
              }
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-box">
              <div class="row"><span class="k">Nº de itens</span><span class="v">${lines.length}</span></div>
              <div class="row total"><span>Total</span><span>${formatEURLocal(order?.total ?? 0)}</span></div>
            </div>
          </div>

          <div class="footer">
            <div>Impresso para fins de controlo interno.</div>
            <div>${esc(STORE_NAME)} · ${esc(STORE_PHONE)}</div>
          </div>
        </div>

        <script>
          // Garante que imagens e layout carregam antes de imprimir
          window.onload = function () {
            setTimeout(function () {
              window.print();
            }, 250);
          };
          window.onafterprint = function () {
            window.close();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
};

export default function OrdersHistoryTable({ orders, onView, onReceive }) {
  return (
    <div>
      <h2 className="text-4xl font-black text-gray-900 leading-tight">
        Histórico de
        <br />
        encomendas
      </h2>

      <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3 font-bold">Nº Encomenda</th>
                <th className="px-4 py-3 font-bold">Editora</th>
                <th className="px-4 py-3 font-bold">Itens</th>
                <th className="px-4 py-3 font-bold">Data Pedido</th>
                <th className="px-4 py-3 font-bold">Entrega Prevista</th>
                <th className="px-4 py-3 font-bold">Total</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {(orders || []).length === 0 ? (
                <tr>
                  <td className="px-4 py-8" colSpan={8}>
                    <EmptyState
                      title="Sem resultados"
                      desc="Tenta ajustar a pesquisa ou o filtro."
                    />
                  </td>
                </tr>
              ) : (
                (orders || []).map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {o.number}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {o.publisher_name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {(o.lines || []).length} livro(s)
                    </td>
                    <td className="px-4 py-3 text-gray-700">{o.requested_at}</td>
                    <td className="px-4 py-3 text-gray-700">{o.expected_at}</td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">
                      {formatEUR(o.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onView(o)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs"
                        >
                          <FaEye />
                          Ver
                        </button>

                        {/* Botão de impressão */}
                        <button
                          onClick={() => handlePrint(o)} 
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs"
                        >
                          <FaPrint />
                          Imprimir
                        </button>

                        {o.status !== "ENTREGUE" ? (
                          <button
                            onClick={() => onReceive(o)}
                            className="inline-flex items-center justify-center gap-2 min-w-[100px] px-4 py-2 rounded-lg bg-black hover:bg-gray-800 text-white font-bold text-xs"
                          >
                            <FaInbox />
                            Receber
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center justify-center gap-2 min-w-[100px] px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold text-xs cursor-not-allowed"
                          >
                            ✓ Recebida
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
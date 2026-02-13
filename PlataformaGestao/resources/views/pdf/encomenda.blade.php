<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Encomenda #{{ $encomenda->id }}</title>
    <style>
        /* Reset e Base */
        body { 
            font-family: 'DejaVu Sans', sans-serif; 
            font-size: 11px; 
            color: #000; 
            margin: 30px; 
            line-height: 1.4;
        }
        
        /* Layout Utilitários */
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }
        
        /* Cabeçalho Principal */
        .header-table { width: 100%; border-bottom: 2px solid #000; margin-bottom: 15px; padding-bottom: 10px; }
        .header-title { font-size: 20px; font-weight: bold; margin: 0; }
        .header-date { font-size: 10px; color: #444; }

        /* Grelha de Informação (Aluno/Escola) - Lado a Lado para poupar espaço */
        .info-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
        .info-table td { vertical-align: top; width: 50%; padding-right: 15px; }
        .info-box { border: 1px solid #ccc; padding: 10px; border-radius: 4px; height: 90px; }
        .info-title { font-size: 9px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 5px; display: block; }
        .info-line { display: block; margin-bottom: 2px; }
        .label { font-weight: bold; font-size: 10px; }

        /* Tabela de Itens */
        table.items { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.items th { 
            border-bottom: 2px solid #000; 
            border-top: 1px solid #000;
            padding: 6px 5px; 
            text-align: left; 
            font-size: 9px; 
            font-weight: bold;
            text-transform: uppercase;
        }
        table.items td { 
            padding: 6px 5px; 
            border-bottom: 1px solid #ddd; 
            vertical-align: middle;
        }
        /* Remover border da ultima linha */
        table.items tr:last-child td { border-bottom: 2px solid #000; }

        /* Badge Encapar (Versão Impressão - Contorno Preto) */
        .badge-encapar { 
            border: 1px solid #000; 
            padding: 1px 4px; 
            font-size: 8px; 
            font-weight: bold; 
            border-radius: 3px;
            display: inline-block;
        }

        /* Totais */
        .total-section { width: 100%; margin-top: 5px; }
        .total-row td { padding: 8px 5px; font-size: 12px; }
        .total-label { font-weight: bold; text-transform: uppercase; }
        .total-value { font-weight: bold; font-size: 14px; }

        /* Observações */
        .obs-box { 
            margin-top: 20px; 
            border: 1px dashed #666; 
            padding: 8px; 
            font-size: 10px;
            background-color: #fff; /* Garante que não gasta tinta de fundo */
        }

        /* Rodapé */
        .footer { 
            position: fixed; 
            bottom: 0; 
            width: 100%; 
            text-align: center; 
            font-size: 9px; 
            border-top: 1px solid #ccc; 
            padding-top: 5px; 
            color: #666;
        }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            <td>
                <h1 class="header-title">ENCOMENDA #{{ $encomenda->id }}</h1>
            </td>
            <td class="text-right">
                <p class="header-date">Data: {{ $encomenda->created_at->format('d/m/Y H:i') }}</p>
            </td>
        </tr>
    </table>

    <table class="info-table">
        <tr>
            <td>
                <div class="info-box">
                    <span class="info-title">Dados do Cliente</span>
                    <span class="info-line"><span class="label">Nome:</span> {{ $encomenda->nome }}</span>
                    <span class="info-line"><span class="label">NIF:</span> {{ $encomenda->nif }}</span>
                    @if($encomenda->telefone)
                        <span class="info-line"><span class="label">Tel:</span> {{ $encomenda->telefone }}</span>
                    @endif
                    @if($encomenda->id_mega)
                        <span class="info-line"><span class="label">ID Mega:</span> {{ $encomenda->id_mega }}</span>
                    @endif
                </div>
            </td>
            <td>
                <div class="info-box">
                    <span class="info-title">Contexto Escolar</span>
                    <span class="info-line"><span class="label">Escola:</span> {{ $encomenda->escola?->nome ?? 'N/A' }}</span>
                    <span class="info-line"><span class="label">Ano:</span> {{ $encomenda->anoEscolar?->name ?? 'N/A' }}</span>
                </div>
            </td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th width="50%">Descrição / Livro</th>
                <th class="text-center" width="10%">Qtd.</th>
                <th class="text-center" width="15%">Serviço</th>
                <th class="text-right" width="12%">Preço Un.</th>
                <th class="text-right" width="13%">Total</th>
            </tr>
        </thead>
        <tbody>
            @php $total = 0; @endphp
            @foreach($encomenda->itens as $item)
                @php
                    $preco = $item->livro?->preco ?? 0;
                    $subtotal = $preco * $item->quantidade;
                    $total += $subtotal;
                @endphp
                <tr>
                    <td>
                        <span class="text-bold">{{ $item->livro?->titulo ?? 'Item Removido' }}</span><br>
                        <span style="font-size: 9px; color: #444;">ISBN: {{ $item->livro?->isbn }} &bull; {{ $item->livro?->editora?->nome }}</span>
                    </td>
                    <td class="text-center">{{ $item->quantidade }}</td>
                    <td class="text-center">
                        @if($item->encapar)
                            <span class="badge-encapar">ENCAPAR</span>
                        @else
                            -
                        @endif
                    </td>
                    <td class="text-right">{{ number_format($preco, 2, ',', '.') }}€</td>
                    <td class="text-right text-bold">{{ number_format($subtotal, 2, ',', '.') }}€</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="total-section">
        <tr class="total-row">
            <td class="text-right total-label" style="padding-top: 10px;">Total a Pagar:</td>
            <td class="text-right total-value" style="width: 100px; padding-top: 10px;">{{ number_format($total, 2, ',', '.') }}€</td>
        </tr>
    </table>

    @if($encomenda->observacao)
        <div class="obs-box">
            <span class="text-bold">OBSERVAÇÕES:</span><br>
            {{ $encomenda->observacao }}
        </div>
    @endif
</body>
</html>
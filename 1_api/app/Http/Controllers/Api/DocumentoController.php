<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Documento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentoController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['funcionario_id' => 'required|integer']);
        return Documento::where('funcionario_id', $request->funcionario_id)->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'funcionario_id' => 'required|integer',
            'titulo' => 'required|string|max:255',
            'categoria' => 'required|string',
            'arquivo' => 'required|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240', // Máx 10MB
        ]);

        $caminho = $request->file('arquivo')->store('documentos', 'public');

        $documento = Documento::create([
            'funcionario_id' => $request->funcionario_id,
            'titulo' => $request->titulo,
            'categoria' => $request->categoria,
            'caminho_arquivo' => $caminho,
            'nome_original' => $request->file('arquivo')->getClientOriginalName(),
            'tipo_mime' => $request->file('arquivo')->getMimeType(),
            'tamanho' => $request->file('arquivo')->getSize(),
        ]);

        return response()->json($documento, 201);
    }

    public function destroy($id)
    {
        $documento = Documento::findOrFail($id);
        Storage::disk('public')->delete($documento->caminho_arquivo);
        $documento->delete();
        return response()->json(null, 204);
    }
}

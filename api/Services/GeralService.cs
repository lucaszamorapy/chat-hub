namespace api.Services
{
    public class GeralService
    {
        private readonly string _caminhoGeral;
        public GeralService(IConfiguration configuration)
        {
            _caminhoGeral = configuration["caminhoPasta"]; ;
        }
        public bool CriarPasta(List<string>? pastas = null)
        {
            bool resultado = false;

            try
            {
                Directory.CreateDirectory(_caminhoGeral);

                if (pastas != null && pastas.Count > 0)
                {
                    foreach (var subpasta in pastas)
                    {
                        var caminhoFinal = Path.Combine(_caminhoGeral, subpasta.Trim(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar));
                        Directory.CreateDirectory(caminhoFinal);

                        resultado = true;
                    }
                }
            }
            catch (Exception ex)
            {
                resultado = false;
            }

            return resultado;
        }

        public async Task<string> SalvarArquivo(IFormFile arquivo, string subpasta = "")
        {
            var pastaDestino = string.IsNullOrWhiteSpace(subpasta) ? _caminhoGeral : Path.Combine(_caminhoGeral, subpasta);

            Directory.CreateDirectory(pastaDestino);

            var caminhoArquivo = Path.Combine(pastaDestino, arquivo.FileName);

            using (var stream = new FileStream(caminhoArquivo, FileMode.Create))
            {
                await arquivo.CopyToAsync(stream);
            }

            return caminhoArquivo;
        }
        public async Task<string> AlterarArquivo(string arquivo, string subpasta = "")
        {
            var pastaConversa = Path.Combine(_caminhoGeral, subpasta);

            // Cria a pasta se não existir
            if (!Directory.Exists(pastaConversa))
            {
                Directory.CreateDirectory(pastaConversa);
            }

            // Gera o caminho do arquivo (por exemplo, conversa.png)
            var caminhoArquivo = Path.Combine(pastaConversa, arquivo);

            // Escreve o conteúdo (precisa ser base64 ou texto)
            System.IO.File.WriteAllText(caminhoArquivo, arquivo);
            var nomeArquivo = Path.GetFileName(caminhoArquivo);

            return nomeArquivo;
        }
    }
}

using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace api.Services
{
    public class GeralService
    {
        private readonly string _caminhoGeral;
        private readonly string _caminhoTemplate;
        private readonly IConfiguration _config;
        public ChatContext? Context { get; set; }
        public GeralService(IConfiguration configuration, ChatContext? dbcontext = null)
        {
            _config = configuration;
            _caminhoGeral = configuration["caminhoPasta"];
            _caminhoTemplate = configuration["caminhoTemplate"];
            Context = dbcontext;
        }
        public int GerarNumero(int digitos)
        {
            Random rnd = new Random();
            int min = (int)Math.Pow(10, digitos - 1);  // ex: 1000
            int max = (int)Math.Pow(10, digitos) - 1;  // ex: 9999
            return rnd.Next(min, max);
        }
        public string PreencherVariaveis(string html, Dictionary<string, string> valores)
        {
            foreach (var item in valores)
            {
                html = html.Replace("{{" + item.Key + "}}", item.Value);
            }
            return html;
        }

        public string CarregarTemplate(string nomeArquivo)
        {
            string caminho = Path.Combine(_caminhoTemplate, nomeArquivo);

            if (!File.Exists(caminho))
            {
                throw new Exception($"Template não encontrado: {caminho}");
            }

            return File.ReadAllText(caminho);
        }

        public Message<object> EnviarEmail(string sDestinatario, string scopia, string scopiaoculta, string replymail, string sAssunto, string sMensagem, List<KeyValuePair<string, string>> filenames)
        {
            try
            {
                SmtpClient objSmtp = new SmtpClient(_config["email_smtp_host"], Convert.ToInt32(Convert.ToInt32(_config["email_porta"])));
                objSmtp.EnableSsl = true;

                MailAddress remetente = new MailAddress(_config["email"], _config["email_usuario"]);
                MailMessage objEmail = new MailMessage();
                string[] dest = sDestinatario.Split(";,".ToCharArray());
                foreach (string d in dest)
                {
                    if (!string.IsNullOrEmpty(d))
                    {
                        objEmail.To.Add(d);
                    }
                }
                string[] copia = scopia.Split(";,".ToCharArray());
                foreach (string d in copia)
                {
                    if (!string.IsNullOrEmpty(d))
                    {
                        objEmail.CC.Add(d);
                    }
                }
                string[] bcc = scopiaoculta.Split(";,".ToCharArray());
                foreach (string d in bcc)
                {
                    if (!string.IsNullOrEmpty(d))
                    {
                        objEmail.Bcc.Add(d);
                    }
                }
                objEmail.From = remetente;
                objEmail.Priority = MailPriority.Normal;
                objEmail.IsBodyHtml = true;
                objEmail.Subject = sAssunto;
                objEmail.Body = sMensagem;
                //objEmail.SubjectEncoding = Encoding.GetEncoding("ISO-8859-1");
                //objEmail.BodyEncoding = Encoding.GetEncoding("ISO-8859-1");
                objEmail.SubjectEncoding = Encoding.UTF8;
                objEmail.BodyEncoding = Encoding.UTF8;

                foreach (var file in filenames)
                {
                    Attachment at = new Attachment(file.Value);
                    at.Name = file.Key;
                    objEmail.Attachments.Add(at);
                }
                NetworkCredential credenciais = new NetworkCredential(
                    _config["email"],
                    _config["email_senha"]
                );

                objSmtp.Credentials = credenciais;

                objSmtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                //ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                objSmtp.Send(objEmail);
                objEmail.Dispose();
            }
            catch (SmtpException se)
            {
                return new Message<object>("Erro ao enviar e-mail", null, true, se.StatusCode + " - " + se.Message +
                    (se.InnerException != null ? " - " + se.InnerException.Message : ""));
            }

            catch (Exception ex)
            {
                return new Message<object>("Erro ao enviar e-mail", null, true, ex.Message +
                    (ex.InnerException != null ? " - " + ex.InnerException.Message : ""));
            }

            return new Message<object>("E-mail enviado com sucesso!", null, false);

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
        public async Task<string> AlterarArquivo(IFormFile arquivo, string subpasta = "")
        {
            var pastaConversa = Path.Combine(_caminhoGeral, subpasta);

            // Cria a pasta se não existir
            if (!Directory.Exists(pastaConversa))
            {
                Directory.CreateDirectory(pastaConversa);
            }

            // Gera nome único para o arquivo
            var caminhoArquivo = Path.Combine(pastaConversa, arquivo.FileName);
            var nomeArquivo = Path.GetFileName(caminhoArquivo);


            // Salva o arquivo físico
            using (var stream = new FileStream(caminhoArquivo, FileMode.Create))
            {
                await arquivo.CopyToAsync(stream);
            }

            return nomeArquivo; // retorna apenas o nome salvo

        }
    }
}

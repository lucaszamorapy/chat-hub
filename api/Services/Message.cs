namespace api.Services
{
    public class Message<T>
    {
        public string Mensagem { get; set; }
        public T? Resultado { get; set; }
        public bool Erro { get; set; }
        public string? MensagemApi { get; set; }

        public Message(string mensagem, T? resultado = default, bool erro = false, string? mensagemApi = null)
        {
            Mensagem = mensagem;
            Resultado = resultado;
            Erro = erro;
            MensagemApi = mensagemApi;
        }

        public Message(string mensagem)
        {
            Mensagem = mensagem;
            Resultado = default;
            Erro = Erro;
            MensagemApi = null;
        }
    }
}

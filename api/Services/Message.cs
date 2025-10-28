namespace api.Services
{
    public class Message<T>
    {
        public string Mensagem { get; set; }
        public T? Resultado { get; set; }
        public bool Erro { get; set; }
        public Message(string mensagem, T resultado, bool erro)
        {
            Mensagem = mensagem;
            Resultado = resultado;
            Erro = erro;
        }

        public Message(string mensagem)
        {
            Erro = Erro;
            Mensagem = mensagem;
            Resultado = default;
        }
    }
}

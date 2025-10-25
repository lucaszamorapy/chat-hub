namespace api.Services
{
    public class Message<T>
    {
        public string Mensagem { get; set; }
        public T Resultado { get; set; }
        public Message(string mensagem, T resultado)
        {
            Mensagem = mensagem;
            Resultado = resultado;
        }
    }
}

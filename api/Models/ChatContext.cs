using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace api.Models;

public partial class ChatContext : DbContext
{
    public ChatContext()
    {
    }

    public virtual DbSet<Conversa> Conversas { get; set; }

    public virtual DbSet<ConversaUsuario> ConversaUsuarios { get; set; }

    public virtual DbSet<Mensagen> Mensagens { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;port=3306;database=chat;user=root;password=Betoven2606", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.42-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Conversa>(entity =>
        {
            entity.HasKey(e => e.ConversaId).HasName("PRIMARY");

            entity.ToTable("conversas");

            entity.Property(e => e.ConversaId).HasColumnName("conversa_id");
            entity.Property(e => e.ConversaFoto)
                .HasMaxLength(45)
                .HasColumnName("conversa_foto");
            entity.Property(e => e.ConversaNome)
                .HasMaxLength(255)
                .HasColumnName("conversa_nome");
            entity.Property(e => e.Grupo).HasColumnName("grupo");
            entity.Property(e => e.Regadh)
                .HasColumnType("datetime")
                .HasColumnName("regadh");
            entity.Property(e => e.Regausu).HasColumnName("regausu");
            entity.Property(e => e.Regidh)
                .HasColumnType("datetime")
                .HasColumnName("regidh");
            entity.Property(e => e.Regiusu).HasColumnName("regiusu");
        });

        modelBuilder.Entity<ConversaUsuario>(entity =>
        {
            entity.HasKey(e => e.ConversaUsuariosId).HasName("PRIMARY");

            entity.ToTable("conversa_usuarios");

            entity.HasIndex(e => e.ConversaId, "fk_conversa_id_idx");

            entity.HasIndex(e => e.UsuarioId, "fk_usuario_id_idx");

            entity.Property(e => e.ConversaUsuariosId).HasColumnName("conversa_usuarios_id");
            entity.Property(e => e.Cargo)
                .HasDefaultValueSql("'Membro'")
                .HasColumnType("enum('Membro','Admin')")
                .HasColumnName("cargo");
            entity.Property(e => e.ConversaId).HasColumnName("conversa_id");
            entity.Property(e => e.Regadh)
                .HasColumnType("datetime")
                .HasColumnName("regadh");
            entity.Property(e => e.Regausu).HasColumnName("regausu");
            entity.Property(e => e.Regidh)
                .HasColumnType("datetime")
                .HasColumnName("regidh");
            entity.Property(e => e.Regiusu).HasColumnName("regiusu");
            entity.Property(e => e.UsuarioEntrou)
                .HasColumnType("datetime")
                .HasColumnName("usuario_entrou");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.Conversa).WithMany(p => p.ConversaUsuarios)
                .HasForeignKey(d => d.ConversaId)
                .HasConstraintName("fk_grupo_conversa");

            entity.HasOne(d => d.Usuario).WithMany(p => p.ConversaUsuarios)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("fk_grupo_usuario");
        });

        modelBuilder.Entity<Mensagen>(entity =>
        {
            entity.HasKey(e => e.MensagemId).HasName("PRIMARY");

            entity.ToTable("mensagens");

            entity.HasIndex(e => e.ConversaId, "fk_conversa_id_idx");

            entity.HasIndex(e => e.UsuarioId, "fk_usuario_id_idx");

            entity.Property(e => e.MensagemId).HasColumnName("mensagem_id");
            entity.Property(e => e.ConversaId).HasColumnName("conversa_id");
            entity.Property(e => e.Mensagem)
                .HasMaxLength(2000)
                .HasColumnName("mensagem");
            entity.Property(e => e.Regadh)
                .HasColumnType("datetime")
                .HasColumnName("regadh");
            entity.Property(e => e.Regausu).HasColumnName("regausu");
            entity.Property(e => e.Regidh)
                .HasColumnType("datetime")
                .HasColumnName("regidh");
            entity.Property(e => e.Regiusu).HasColumnName("regiusu");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.Conversa).WithMany(p => p.Mensagens)
                .HasForeignKey(d => d.ConversaId)
                .HasConstraintName("fk_mensagens_conversas");

            entity.HasOne(d => d.Usuario).WithMany(p => p.Mensagens)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("fk_mensagens_usuarios");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.UsuarioId).HasName("PRIMARY");

            entity.ToTable("usuarios");

            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");
            entity.Property(e => e.Apelido)
                .HasMaxLength(255)
                .HasColumnName("apelido");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.Nome)
                .HasMaxLength(255)
                .HasColumnName("nome");
            entity.Property(e => e.PerfilFoto)
                .HasMaxLength(255)
                .HasColumnName("perfil_foto");
            entity.Property(e => e.Regadh)
                .HasColumnType("datetime")
                .HasColumnName("regadh");
            entity.Property(e => e.Regausu).HasColumnName("regausu");
            entity.Property(e => e.Regidh)
                .HasColumnType("datetime")
                .HasColumnName("regidh");
            entity.Property(e => e.Regiusu).HasColumnName("regiusu");
            entity.Property(e => e.Senha)
                .HasMaxLength(255)
                .HasColumnName("senha");
            entity.Property(e => e.Status)
                .HasMaxLength(255)
                .HasColumnName("status");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

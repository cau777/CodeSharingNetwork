﻿// <auto-generated />
using System;
using Api.DatabaseContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Api.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "5.0.10");

            modelBuilder.Entity("Api.Models.CodeSnippet", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AuthorUsername")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<string>("Language")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<long>("LikeCount")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Posted")
                        .HasColumnType("TEXT");

                    b.Property<string>("TagsString")
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("AuthorUsername");

                    b.ToTable("CodeSnippets");
                });

            modelBuilder.Entity("Api.Models.Like", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<long?>("SnippetId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Username")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("SnippetId");

                    b.HasIndex("Username");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("Api.Models.User", b =>
                {
                    b.Property<string>("Username")
                        .HasColumnType("TEXT");

                    b.Property<string>("Bio")
                        .HasMaxLength(500)
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("ImageBytes")
                        .HasColumnType("BLOB");

                    b.Property<string>("Name")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("Password")
                        .HasMaxLength(32)
                        .HasColumnType("BLOB");

                    b.HasKey("Username");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Api.Models.CodeSnippet", b =>
                {
                    b.HasOne("Api.Models.User", "Author")
                        .WithMany("SnippetsPosted")
                        .HasForeignKey("AuthorUsername")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Author");
                });

            modelBuilder.Entity("Api.Models.Like", b =>
                {
                    b.HasOne("Api.Models.CodeSnippet", "Snippet")
                        .WithMany()
                        .HasForeignKey("SnippetId");

                    b.HasOne("Api.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("Username");

                    b.Navigation("Snippet");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Api.Models.User", b =>
                {
                    b.Navigation("SnippetsPosted");
                });
#pragma warning restore 612, 618
        }
    }
}

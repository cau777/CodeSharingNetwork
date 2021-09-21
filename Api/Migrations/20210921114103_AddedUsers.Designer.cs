﻿// <auto-generated />
using System;
using Api.DatabaseContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Api.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20210921114103_AddedUsers")]
    partial class AddedUsers
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "5.0.10");

            modelBuilder.Entity("Api.Models.CodeSnippet", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AuthorName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<long>("LikeCount")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("AuthorName");

                    b.ToTable("CodeSnippets");
                });

            modelBuilder.Entity("Api.Models.Like", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<long?>("SnippetId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UserName")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("SnippetId");

                    b.HasIndex("UserName");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("Api.Models.User", b =>
                {
                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("Password")
                        .HasMaxLength(32)
                        .HasColumnType("BLOB");

                    b.HasKey("Name");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Api.Models.CodeSnippet", b =>
                {
                    b.HasOne("Api.Models.User", "Author")
                        .WithMany("SnippetsPosted")
                        .HasForeignKey("AuthorName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Author");
                });

            modelBuilder.Entity("Api.Models.Like", b =>
                {
                    b.HasOne("Api.Models.CodeSnippet", "Snippet")
                        .WithMany("Likes")
                        .HasForeignKey("SnippetId");

                    b.HasOne("Api.Models.User", "User")
                        .WithMany("LikesGiven")
                        .HasForeignKey("UserName");

                    b.Navigation("Snippet");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Api.Models.CodeSnippet", b =>
                {
                    b.Navigation("Likes");
                });

            modelBuilder.Entity("Api.Models.User", b =>
                {
                    b.Navigation("LikesGiven");

                    b.Navigation("SnippetsPosted");
                });
#pragma warning restore 612, 618
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class RenamedUsername : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CodeSnippets_Users_AuthorName",
                table: "CodeSnippets");

            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Users_UserName",
                table: "Likes");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Likes",
                newName: "Username");

            migrationBuilder.RenameIndex(
                name: "IX_Likes_UserName",
                table: "Likes",
                newName: "IX_Likes_Username");

            migrationBuilder.RenameColumn(
                name: "AuthorName",
                table: "CodeSnippets",
                newName: "AuthorUsername");

            migrationBuilder.RenameIndex(
                name: "IX_CodeSnippets_AuthorName",
                table: "CodeSnippets",
                newName: "IX_CodeSnippets_AuthorUsername");

            migrationBuilder.AddForeignKey(
                name: "FK_CodeSnippets_Users_AuthorUsername",
                table: "CodeSnippets",
                column: "AuthorUsername",
                principalTable: "Users",
                principalColumn: "Username",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Users_Username",
                table: "Likes",
                column: "Username",
                principalTable: "Users",
                principalColumn: "Username",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CodeSnippets_Users_AuthorUsername",
                table: "CodeSnippets");

            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Users_Username",
                table: "Likes");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Likes",
                newName: "UserName");

            migrationBuilder.RenameIndex(
                name: "IX_Likes_Username",
                table: "Likes",
                newName: "IX_Likes_UserName");

            migrationBuilder.RenameColumn(
                name: "AuthorUsername",
                table: "CodeSnippets",
                newName: "AuthorName");

            migrationBuilder.RenameIndex(
                name: "IX_CodeSnippets_AuthorUsername",
                table: "CodeSnippets",
                newName: "IX_CodeSnippets_AuthorName");

            migrationBuilder.AddForeignKey(
                name: "FK_CodeSnippets_Users_AuthorName",
                table: "CodeSnippets",
                column: "AuthorName",
                principalTable: "Users",
                principalColumn: "Name",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Users_UserName",
                table: "Likes",
                column: "UserName",
                principalTable: "Users",
                principalColumn: "Name",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

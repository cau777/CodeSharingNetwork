﻿namespace Api.Controllers.DataTransferObjects
{
    public class GetSnippetDTO
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string AuthorName { get; set; }
        public string Description { get; set; }
        public string Code { get; set; }
        public long LikeCount { get; set; }
    }
}
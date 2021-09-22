namespace Api.Services.Database
{
    public interface IContainsUserChecker
    {
        bool ContainsName(string name);
    }
}
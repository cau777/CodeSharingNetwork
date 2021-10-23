using JetBrains.Annotations;

namespace Api.DataStructures
{
    public interface IGraph<T>
    {
        bool ContainsNode([NotNull] T element);
        bool ContainsEdge([NotNull] T element1, [NotNull] T element2);
        void AddNode([NotNull] T element);
        void AddEdge([NotNull] T element1, [NotNull] T element2);
    }
}
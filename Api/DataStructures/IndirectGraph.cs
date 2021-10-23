using System;
using System.Collections.Generic;
using JetBrains.Annotations;

namespace Api.DataStructures
{
    public class IndirectGraph<T> : IGraph<T>
    {
        private readonly ISet<T> _nodes;
        private readonly ISet<(T, T)> _edges;

        public IndirectGraph()
        {
            _nodes = new HashSet<T>();
            _edges = new HashSet<(T, T)>();
        }

        public bool ContainsNode([NotNull] T element)
        {
            return _nodes.Contains(element);
        }
        
        public bool ContainsEdge([NotNull] T element1, [NotNull] T element2)
        {
            return _edges.Contains((element1, element2)) || _edges.Contains((element2, element1));
        }

        public void AddNode([NotNull] T element)
        {
            _nodes.Add(element);
        }

        public void AddEdge([NotNull] T element1, [NotNull] T element2)
        {
            if (element1.Equals(element2))
                throw new ArgumentException("Elements can't be equal");

            _nodes.Add(element1);
            _nodes.Add(element2);

            _edges.Add((element1, element2));
        }
    }
}
using System.Collections.Generic;

namespace Api.Utils
{
    public static class IterationUtils
    {
        /// <summary>
        /// Implementation of Python's zip function
        /// </summary>
        /// <param name="e1"></param>
        /// <param name="e2"></param>
        /// <typeparam name="T1"></typeparam>
        /// <typeparam name="T2"></typeparam>
        /// <returns></returns>
        public static IEnumerable<(T1, T2)> Zip<T1, T2>(IEnumerable<T1> e1, IEnumerable<T2> e2)
        {
            using IEnumerator<T1> t1 = e1.GetEnumerator();
            using IEnumerator<T2> t2 = e2.GetEnumerator();

            while (t1.MoveNext() && t2.MoveNext())
            {
                yield return (t1.Current, t2.Current);
            }
        }
    }
}
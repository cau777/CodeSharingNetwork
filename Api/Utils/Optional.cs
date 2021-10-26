using System;

namespace Api.Utils
{
    public readonly struct Optional<T>
    {
        public bool HasValue { get; }
        public T Value { get; }

        public Optional(T value)
        {
            Value = value;
            HasValue = true;
        }

        public static implicit operator Optional<T>(T value)
        {
            return new Optional<T>(value);
        }
    }
}
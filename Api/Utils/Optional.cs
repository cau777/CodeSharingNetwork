namespace Api.Utils
{
    /// <summary>
    /// Struct to store a value or not. Based on Nullable but works with reference types
    /// </summary>
    /// <typeparam name="T"></typeparam>
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
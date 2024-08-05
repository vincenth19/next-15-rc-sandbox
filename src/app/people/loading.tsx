const Loading = () => {
  return (
    <div
      className="flex flex-col w-full h-full items-center justify-center"
      style={{
        height: "calc(100dvh - 5rem)",
      }}
    >
      <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-4 border-t-blue-600" />
      <p className="mt-4 text-lg font-semibold">Loading...</p>
    </div>
  );
};

export default Loading;

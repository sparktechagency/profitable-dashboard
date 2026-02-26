const NoAccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold text-red-600">No Access</h1>
      <p className="text-gray-600">
        You don't have permission to access this page.
      </p>
    </div>
  );
};

export default NoAccess;
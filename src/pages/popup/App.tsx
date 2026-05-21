const App = () => {
  return (
    <div className="w-80 p-4">
      <h1>Chrome Extension</h1>

      <button
        onClick={() => {
          chrome.runtime.openOptionsPage();
        }}
      >
        Settings
      </button>
    </div>
  );
};

export default App;

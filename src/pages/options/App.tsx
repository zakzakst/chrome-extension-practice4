const App = () => {
  return (
    <div className="p-4">
      <div>
        <h1>設定</h1>

        <button
          onClick={async () => {
            await chrome.storage.local.set({
              username: "yamada",
            });

            alert("saved");
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default App;

import { ChatProvider } from "./ChatContext";
import JoinCreateChat from "./JoinCreateChat";


function App() {

    return (
        <div>
            <ChatProvider>
                <JoinCreateChat />
            </ChatProvider>
        </div>
    );
}

export default App;

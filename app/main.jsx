import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Chat, HeroCard } from '@progress/kendo-react-conversational-ui';
import { ApiAiClient } from 'api-ai-javascript';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
        this.client = new ApiAiClient({
            accessToken: '7a69bc87bbde498b917b2e41080f895c'
        });
        this.client.eventRequest("Welcome").then(this.onResponse, this);
        this.user = {
            id: 1,
            name: 'You',
            avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQohLaMwMK2rUNHE-CpNCEDBZARY9zyMFyKZEMInACf5pqnI28H&usqp=CAU"
        };
        this.bot = {
            id: "botty",
            name: 'CoRelief',
            avatarUrl: "https://www.pikpng.com/pngl/m/461-4618098_png-image-with-transparent-background-logo-hand-heart.png"
        };
        this.addNewMessage = this.addNewMessage.bind(this);
    }

    parseActions = (actions) => {
        if (actions !== undefined) {
            actions.map(action => {
                if (action.type === "postBack") {
                    action.type = 'reply';
                }
            });
            return actions;
        }
        return [];
    }

    parseText = (event) => {
        if (event.action !== undefined) {
            return event.action.value;
        } else if (event.value) {
            return event.value;
        } else {
            return event.message.text;
        }
    }

    onResponse = (activity) => {
        let that = this;
        activity.result.fulfillment.messages.forEach(function (element) {
            let newMessage;
            newMessage = {
                text: element.speech,
                author: that.bot,
                timestamp: new Date(activity.timestamp),
                suggestedActions: element.replies ? element.replies.map(x => { return { type: "reply", title: x, value: x }; }) : []
            };
            that.setState((prevState) => {
                return { messages: [...prevState.messages, newMessage] };
            });
        });
    }

    addNewMessage = (event) => {
        let value = this.parseText(event);
        this.client.textRequest(value.toString()).then(this.onResponse, this);
        if (!event.value) {
            this.setState((prevState) => {
                return { messages: [...prevState.messages, { author: this.user, text: value, timestamp: new Date() }] };
            });
        }
    };

    render() {
        return (
            <Chat
                messages={this.state.messages}
                user={this.user}
                onMessageSend={this.addNewMessage}
                attachmentTemplate={this.аttachmentTemplate}
            />
        );
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('my-app')
);

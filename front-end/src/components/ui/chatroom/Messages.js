import React, { Component } from 'react'
import {Message} from '.'

class Messages extends Component {
    componentDidUpdate() {
        const objDiv = document.getElementById('messageList')
        objDiv.scrollTop = objDiv.scrollHeight
    }

    render() {
        return (
          <div className="messages" id="messageList">
            {this.props.messages.map((message, i) => (
              <Message 
                key={i}
                usertype={message.usertype}
                username={message.username}
                text={message.text}
                timestamp={message.timestamp}
                fromMe={message.fromMe}
              />
            ))}
          </div>
        )
    }
}

export default Messages
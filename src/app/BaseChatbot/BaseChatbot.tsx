import * as React from 'react';
import {
  Chatbot,
  ChatbotAlert,
  ChatbotContent,
  ChatbotDisplayMode,
  ChatbotFooter,
  ChatbotFootnote,
  ChatbotHeader,
  ChatbotHeaderMain,
  ChatbotHeaderTitle,
  ChatbotWelcomePrompt,
  Message,
  MessageBar,
  MessageBox,
  MessageProps,
} from '@patternfly/virtual-assistant';
import { useLoaderData } from 'react-router-dom';
import { CannedChatbot } from '../types/CannedChatbot';
interface Source {
  link: string;
}

const getChatbot = (id: string) => {
  const url = process.env.REACT_APP_INFO_URL ?? '';
  return fetch(url)
    .then((res) => res.json())
    .then((data: CannedChatbot[]) => {
      const filteredChatbots = data.filter((chatbot) => chatbot.name === id);
      if (filteredChatbots.length > 0) {
        return {
          displayName: filteredChatbots[0].displayName,
          name: filteredChatbots[0].name,
          id: filteredChatbots[0].id,
          llmConnection: filteredChatbots[0].llmConnection,
          retrieverConnection: filteredChatbots[0].retrieverConnection,
        };
      } else {
        throw new Response('Not Found', { status: 404 });
      }
    })
    .catch((e) => {
      throw new Response(e.message, { status: 404 });
    });
};

export async function loader({ params }) {
  const chatbot = await getChatbot(params.chatbotId);
  return { chatbot };
}

const BaseChatbot: React.FunctionComponent = () => {
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const [currentMessage, setCurrentMessage] = React.useState<string[]>([]);
  const [currentSources, setCurrentSources] = React.useState<Source[]>();
  const [isSendButtonDisabled, setIsSendButtonDisabled] = React.useState(false);
  const scrollToBottomRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<{ title: string; body: string }>();
  const [announcement, setAnnouncement] = React.useState<string>();
  const { chatbot } = useLoaderData() as { chatbot: CannedChatbot };

  React.useEffect(() => {
    document.title = `Red Hat Composer AI Studio | ${chatbot.name}`;
  }, []);

  React.useEffect(() => {
    document.title = `Red Hat Composer AI Studio | ${chatbot.name}`;
  }, [chatbot]);

  React.useEffect(() => {
    document.title = `Red Hat Composer AI Studio | ${chatbot.name}${announcement ? ` - ${announcement}` : ''}`;
  }, [announcement]);

  // Auto-scrolls to the latest message
  React.useEffect(() => {
    // don't scroll the first load, but scroll if there's a current stream or a new source has popped up
    if (messages.length > 0 || currentMessage || currentSources) {
      scrollToBottomRef.current?.scrollIntoView();
    }
  }, [messages, currentMessage, currentSources]);

  const url = process.env.REACT_APP_ROUTER_URL ?? '';

  async function fetchData(userMessage: string) {
    let isSource = false;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        assistantName: chatbot.name,
      }),
    });

    if (!response.ok || !response.body) {
      switch (response.status) {
        case 500:
          throw new Error('500');
        case 404:
          throw new Error('404');
        default:
          throw new Error('Other');
      }
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done;
    const sources: string[] = [];

    while (!done) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      if (chunk.includes('Sources used to generate this content')) {
        sources.push(chunk);
        isSource = true;
      } else {
        if (isSource) {
          sources.push(chunk);
        } else {
          setCurrentMessage((prevData) => [...prevData, chunk]);
        }
      }
    }

    if (sources) {
      const sourceLinks = sources.join('').split('Sources used to generate this content:\n')[1];
      const sourceLinksArr = sourceLinks.split('\n').filter((source) => source !== '');
      const formattedSources: Source[] = [];
      sourceLinksArr.forEach((source) => formattedSources.push({ link: source }));
      return formattedSources;
    }

    return undefined;
  }

  const getId = () => {
    const date = Date.now() + Math.random();
    return date.toString();
  };

  const ERROR_TITLE = {
    'Error: 404': '404: Network error',
    'Error: 500': 'Server error',
    'Error: Other': 'Error',
  };

  const ERROR_BODY = {
    'Error: 404': `${chatbot.displayName} is currently unavailable. Use a different assistant or try again later.`,
    'Error: 500': `${chatbot.displayName} has encountered an error and is unable to answer your question. Use a different assistant or try again later.`,
    'Error: Other': `${chatbot.displayName} has encountered an error and is unable to answer your question. Use a different assistant or try again later.`,
  };

  const handleError = (e: string) => {
    const newError = { title: ERROR_TITLE[e], body: ERROR_BODY[e] };
    setError(newError);
    // make announcement to assistive devices that there was an error
    setAnnouncement(`Error: ${newError.title} ${newError.body}`);
  };

  const handleSend = async (input: string) => {
    setIsSendButtonDisabled(true);
    const newMessages = structuredClone(messages);
    if (currentMessage.length > 0) {
      newMessages.push({
        id: getId(),
        name: 'Chatbot',
        role: 'bot',
        content: currentMessage.join(''),
        ...(currentSources && { sources: { sources: currentSources } }),
      });
      setCurrentMessage([]);
      setCurrentSources(undefined);
    }
    newMessages.push({ id: getId(), name: 'You', role: 'user', content: input });
    setMessages(newMessages);
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`Message from You: ${input}. Message from Chatbot is loading.`);

    const sources = await fetchData(input).catch((e) => {
      handleError(e);
    });
    if (sources) {
      setCurrentSources(sources);
    }
    // make announcement to assistive devices that new message has been added
    currentMessage.length > 0 && setAnnouncement(`Message from Chatbot: ${currentMessage.join('')}`);
    setIsSendButtonDisabled(false);
  };

  const displayMode = ChatbotDisplayMode.embedded;

  return (
    <Chatbot displayMode={displayMode}>
      <ChatbotHeader>
        <ChatbotHeaderMain>
          <ChatbotHeaderTitle>{chatbot.displayName}</ChatbotHeaderTitle>
        </ChatbotHeaderMain>
      </ChatbotHeader>
      <ChatbotContent>
        <MessageBox announcement={announcement}>
          {error && (
            <ChatbotAlert
              variant="danger"
              // eslint-disable-next-line no-console
              onClose={() => {
                setError(undefined);
              }}
              title={error.title}
            >
              {error.body}
            </ChatbotAlert>
          )}
          <ChatbotWelcomePrompt title="Hello, Chatbot User" description="How may I help you today?" />
          {messages.map((message) => (
            <Message key={message.id} {...message} />
          ))}
          {currentMessage.length > 0 && (
            <Message
              name="Chatbot"
              key="currentMessage"
              role="bot"
              content={currentMessage.join('')}
              {...(currentSources && { sources: { sources: currentSources } })}
            />
          )}
          <div ref={scrollToBottomRef}></div>
        </MessageBox>
      </ChatbotContent>
      <ChatbotFooter>
        <MessageBar
          onSendMessage={handleSend}
          hasMicrophoneButton
          hasAttachButton={false}
          isSendButtonDisabled={isSendButtonDisabled}
        />
        <ChatbotFootnote label="Verify all information from this tool. LLMs make mistakes." />
      </ChatbotFooter>
    </Chatbot>
  );
};

export { BaseChatbot };

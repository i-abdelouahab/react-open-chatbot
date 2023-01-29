// Imports
import React from 'react'
import { useEffect, useState } from 'react'
import { Configuration, OpenAIApi } from 'openai'
import { ScaleLoader } from 'react-spinners'
import "./Chatgpt.css"

const Chatgpt = () => {
    // Create a new Configuration object with your OpenAI API key and a user agent
    const configuration = new Configuration({
        apiKey : "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",
        userAgent: 'ChatGPT'
    })
    // Create a new OpenAIApi object with the configuration
    const openai = new OpenAIApi(configuration)
    // State variables to track loading state, the index of the current character being typed,
    // the current text index, the current prompt, and the response from the API
    const [loading, setLoading] = useState(false)
    const [index, setIndex] = useState(0)
    // State to keep track of the current index of the chat history
    const [currentTextIndex, setCurrentTextIndex] = useState('')
    // State to keep track of the current message the user is typing
    const [prompt, setPrompt] = useState('')
    // State to keep track of the current response from the chatbot
    const [response, setResponse ] = useState('')
    // State to keep track of the chat history
    const [history, setHistory] = useState([])
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory'));
    // Use useEffect to check if there is any stored history in localStorage and set it in state
    useEffect(() => {
        const storedHistory = localStorage.getItem('chatHistory')
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory))
        }
    }, [])
    // Function to send the current prompt to the OpenAI API and update state with the response
    const sendMessage = async () => {
        // Make a request to the chatbot API to get the response
        const response = await openai.createCompletion({
            model : 'text-davinci-003',
            prompt : prompt, 
            temperature : 0, 
            max_tokens : 500
        })
        setResponse(response.data.choices[0].text)
        setLoading(false)
        // Add the current prompt and response to the chat history
        setHistory([...history, { prompt, response: response.data.choices[0].text }])
        localStorage.setItem('chatHistory', JSON.stringify([...history, { prompt, response: response.data.choices[0].text }]))

    }
    // Function to update the prompt state when the textarea value changes
    const updatePrompt = (e) => {
        setPrompt(e.target.value)
    }
    // Function to handle form submission
    const submitForm = (e) => {
        e.preventDefault()
        setTimeout(() => {
            setPrompt("");
          }, 1000);
        //checking if the button is processing something 
        if(loading){
            return
        }
        setLoading(true)
        sendMessage()
        setIndex(0)
        setResponse('')
        setCurrentTextIndex('')
    }
    // Use useEffect to increment the index and display each character of the response one by one
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => prev + 1)
        }, 20)
        if(index >= response.length){
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [index, response])

    // This useEffect is called whenever the "index" value changes.
    useEffect(() => {
        if(response.length >= 1){
            // If the "response" array has at least one element, set the "currentTextIndex" state to the value of the element at the current "index" position.
            setCurrentTextIndex(prev => prev + response[index])
        }
        if(index >= response.length){
            // If the "index" value is greater than or equal to the length of the "response" array, set the "currentTextIndex" state to the entire "response" array.
            setCurrentTextIndex(response)
        }
    }, [index])
    
    return(
        <section>
            {/* This section contains the chatbot interface, it is divided into 3 main sections:
                - header: contains the title of the chatbot
                - container: contains the chat history, the current text index and the form to send messages
                - form: contains the textarea to type the message and the submit button to send it
            */}
            <header className='header container'> 
            {/* this is the title of the chatbot */}
                <h2>Open-Chatbot</h2>
            </header>
            <div className='container'>
                {/* this div contains the chat history and the current text index */}
                <div className='response'>
                <div className="chat-container">
                {/* this div contains the chat history */}
                <div className="chat-message">
                {
                /* This map function loops through the chatHistory array and renders each history object as a div */
                Array.isArray(chatHistory) &&
                chatHistory.length > 0 &&
                chatHistory.map((history, index) => (
                    <div key={index} className="chat-message">
                    {/* Renders the prompt from the history object */}
                    <div className="chat-prompt">{history.prompt}</div>
                    {/* Renders the response from the history object */}
                    <div className="chat-response">{history.response}</div>
                    </div>
                ))
                }
                </div>
                <hr/><br/>
                {/* this table contains the current text index */}
                <table>
                    <tbody>
                    <tr>
                        <td>
                            {/* this is the icon of the chatbot */}
                            <img src="https://brandlogovector.com/wp-content/uploads/2023/01/ChatGPT-Icon-Logo-PNG.png" alt="Chatgpt icon" style={{width: "30px", height: "30px"}}/>
                        </td>
                        <td>&nbsp;</td>
                        <td>
                            {currentTextIndex}
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>
            <form 
                className='message__form container'
                onSubmit={submitForm}
            >
                {/* this is the textarea to type the message */}
                <textarea 
                    type={"text"}
                    placeholder = {"Type your message..."}
                    name = {"prompt"}
                    className = {"message__form-input"}
                    rows = {1}
                    value = {prompt}
                    onChange = {updatePrompt}
                    required
                >
                </textarea>
                {/* this is the submit button to send the message */}
                <button 
                    className='message__form-submit'
                    style={{
                        cursor : loading ? 'wait' : 'pointer',
                        display : loading ? 'flex' : 'inline-block',
                        gap : 4,
                    }}
                >
                    {/* Conditionally renders a loading spinner based on the loading state */}
                    Send
                {
                    loading ? 
                    <ScaleLoader
                     width={2}
                     height = {15}
                     color = {"#fff"}
                    /> 
                    : ""
                    
                }
                </button>
            </form>
        </section>
    )
}
export default Chatgpt
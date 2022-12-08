import { IncomingMessageParser } from '@app/functions/bot-engine';

import { ImageMessage, LocationMessage, QuestionMessage, TextMessage } from '@app/model/convs-mgr/conversations/messages';
import { ImagePayload, InteractiveRawButtonReplyMessage, LocationPayload, MessageTypes, TextMessagePayload, WhatsAppMessagePayLoad } from '@app/model/convs-mgr/functions';

/**
 * Our chatbot recieves different types of messages, be it a text message, a location, an image, ...
 *
 * We therefore need to convert this message to a standardized format so that our chatbot can read and process the message
 *
 * Here we define methods that parse in messages  received from whatsapp and return a standardized format required by the chatbot
 *
 * @see WhatsAppMessageType - for the types of messages received from whatsapp
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
 *
 * @param {message} - This is the incoming message from whatsapp via the communication channel @see {CommunicationChannel}
 *
 */
export class WhatsappIncomingMessageParser extends IncomingMessageParser
{
  /**
   * Converts simple whatsapp text message to Base Message
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
   */
  protected parseInTextMessage(message: TextMessagePayload): TextMessage
  {
    // Create the base message object
    const newMessage: TextMessage = {
      id: this.getMessageId(),
      type: MessageTypes.TEXT,
      endUserPhoneNumber: message.from,
      text: message.text.body,
      payload: message,
    };

    return newMessage;
  }

  /**
   * Converts an interactive whatsapp message to a standadized Question Message @see {QuestionMessage}
   *
   * An interactive message works well with a question block, as the user will be given options to click
   *
   * When they click an option we will get the id of the button clicked and the text of the button
   *
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#reply-button
   */
  protected parseInInteractiveButtonMessage(message: WhatsAppMessagePayLoad): QuestionMessage
  {
    const interactiveMessage = message as InteractiveRawButtonReplyMessage;

    const baseMessage: QuestionMessage = {
      id: this.getMessageId(),
      type: MessageTypes.QUESTION,
      endUserPhoneNumber: message.from,
      optionId: interactiveMessage.interactive.button_reply.id,
      optionText: interactiveMessage.interactive.button_reply.title,
      payload: message,
    };

    return baseMessage;
  }

  /**
   * Converts an location whatsapp message to a standadized location Message @see {LocationMessageBlock}
   *
   * When a user sends their location, whatsapp sends us their location in terms of longitude and latitude
   *
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#location-messages
   */
  protected parseInLocationMessage(incomingMessage: LocationPayload): LocationMessage
  {
    const standardMessage: LocationMessage = {
      id: this.getMessageId(),
      type: MessageTypes.LOCATION,
      endUserPhoneNumber: incomingMessage.from,
      location: incomingMessage.location,
      payload: incomingMessage,
    };

    return standardMessage;
  }

  /**
   * Converts an location whatsapp message to a standadized location Message @see {LocationMessageBlock}
   *
   * When a user sends their location, whatsapp sends us their location in terms of longitude and latitude
   *
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#location-messages
   */
  protected parseInImageMessage(incomingMessage: ImagePayload): ImageMessage
  {
    const standardMessage: ImageMessage = {
      id: this.getMessageId(),
      type: MessageTypes.LOCATION,
      endUserPhoneNumber: incomingMessage.from,
      imageId: incomingMessage.id,
      payload: incomingMessage,
    };

    return standardMessage;
  }
}
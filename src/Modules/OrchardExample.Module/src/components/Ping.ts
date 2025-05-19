import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('/ping-hub', {})
  .withAutomaticReconnect()
  .build();

connection.on('pong', async (message: string) => {
  console.log(`Got a response message as ${message}`);
});

async function startConnection() {
  await connection.start();
  console.log('connected');
}

startConnection();

export default function Ping() {
  console.log('calling ping');
}







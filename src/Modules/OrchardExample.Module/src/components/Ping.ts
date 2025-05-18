import * as signalR from '@microsoft/signalr';


export default async function ping() {

  const connection = new signalR.HubConnectionBuilder()
    .withUrl('/ping-hub', {})
    .withAutomaticReconnect()
    .build();

  connection.on('pong', async (message: string) => {
    console.log(`Got a response message as ${message}`);
  });


  await connection.start();
  console.log('connected');
};




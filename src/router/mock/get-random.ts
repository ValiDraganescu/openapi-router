const stringsBase = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id pulvinar est. Ut ut augue gravida, viverra magna a, malesuada dolor. Curabitur cursus maximus felis a sodales. Phasellus tristique nisl a aliquam tristique. Maecenas dapibus sed nisl eget lacinia. Vivamus maximus id turpis ut ullamcorper. Ut aliquam ante risus, ac laoreet turpis iaculis ut. Praesent sapien sem, varius non vestibulum id, convallis a velit. Nam non nisl nisl. Quisque euismod at felis vitae blandit. Aliquam eget pulvinar lectus. Vivamus nec pulvinar justo, ut commodo mauris. Aenean tincidunt augue non volutpat congue. Maecenas scelerisque ultrices urna consequat congue. Quisque auctor interdum pharetra. Cras magna tellus, euismod eu auctor eget, fermentum ac nulla.
Duis ultricies efficitur quam, vitae tempus lorem malesuada nec. Nullam tempor metus eu feugiat viverra. Nunc in nibh fermentum, vehicula justo non, sagittis risus. Etiam tincidunt vitae erat at tristique. Mauris eget felis quam. Ut dapibus tortor vitae turpis accumsan, a hendrerit tellus vulputate. Nullam quis maximus risus, vitae pretium justo. Aenean malesuada augue mauris, sit amet aliquam turpis mattis iaculis. Etiam lacus nisl, finibus nec nunc vel, dictum fringilla sapien. Fusce condimentum venenatis massa, sit amet gravida orci. Nullam malesuada nibh vitae est tempus, et volutpat sem iaculis. Cras molestie, nunc sit amet aliquet faucibus, dolor eros sagittis risus, non interdum justo elit vel ipsum. In accumsan libero lacinia volutpat tempus. Donec id urna sagittis, condimentum ex ut, facilisis risus. Mauris tortor sapien, accumsan a ex nec, blandit egestas orci. Nam porttitor, purus at porttitor consequat, neque magna dictum arcu, ut laoreet ex tortor et arcu.
Vivamus tellus velit, accumsan vitae sollicitudin a, iaculis et ex. Sed mollis mauris risus, id rutrum eros molestie et. Proin pretium gravida vestibulum. Praesent dapibus id purus at rhoncus. Fusce scelerisque massa ut purus convallis consectetur. Quisque auctor sagittis ipsum, vel porta augue vehicula vitae. Suspendisse vel dolor congue, efficitur orci ac, tempor turpis.
Phasellus non neque efficitur, porta massa in, aliquam nunc. Suspendisse malesuada, dui et tincidunt consequat, lacus nisi malesuada quam, nec efficitur ante nisi ullamcorper neque. Maecenas a odio porta mauris sodales euismod in sit amet metus. Cras egestas vestibulum arcu, sed tristique neque ullamcorper ut. Donec tempor pharetra bibendum. Suspendisse mauris mauris, elementum at vulputate convallis, ullamcorper ac tellus. Nunc finibus ultricies sem, et varius urna aliquet eu. Vivamus nibh tellus, facilisis a odio vel, sollicitudin interdum mauris. Donec rhoncus, felis sed mollis pellentesque, justo ex congue sapien, et varius tortor orci non magna. Ut eleifend diam dignissim, blandit urna eget, commodo nulla.
Nulla pulvinar dolor egestas commodo dignissim. Nam molestie metus dolor. Aliquam lacinia malesuada tincidunt. Nullam at rutrum ligula, aliquet molestie lorem. Aenean pulvinar lacus et vulputate condimentum. Morbi feugiat ligula eget dui porta tempor. Vestibulum venenatis consectetur ipsum, eget scelerisque dui sollicitudin id. Ut mattis maximus augue, id vestibulum purus egestas vehicula. Nulla aliquet ligula eget orci euismod vulputate.`;

const strings = stringsBase.split(" ");

export const getDefaultRandomString = (): string => {
  const index = getRandomInt(0, strings.length);
  return strings[index];
};

export const getDefaultRandomInteger = (): number => {
  return getRandomInt(0, 1000);
};

export const getRandomBoolean = (): boolean => {
  return getRandomInt(0, 1) === 0;
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

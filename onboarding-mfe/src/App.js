import React, {useEffect, useState} from 'react';
import {Card, CardGrid} from "./components/Card";
import {Codeblock} from "./components/Codeblock";
import SupportedFrameworks from './supported-frameworks.png';


const App = ()  => {
  const [value, setValue] = useState(1);

  useEffect(() => {
    if (value !== 3) {
      console.log('schedu', value)
      setTimeout(() => setValue(value + 1), 150);
    }
  }, [value]);

  return <CardGrid>
    <Card
      step={1}
      visible={value >= 1}
      title="Create Micro-Frontends with a simple CLI"
      description="Instead of complex configurations you can just export your micro-frontend with “ragu-cli”."
    >
      <Codeblock>
        $ npx ragu-cli run my-component-name.js<br /><br />

        Welcome to 🔪 RaguServer<br />
        The application is running at http://localhost:3100
      </Codeblock>
    </Card>
    <Card
      step={2}
      visible={value >= 2}
      title="Your favorite framework as Micro-frontend"
      image={SupportedFrameworks}
      description="You can just export a function that renders your component and you have a micro-frontend!"
    >
      <Codeblock>
        # my-hello-micro-frontend.jsx<br /><br />

        export default (props) =><br />
        &nbsp;&nbsp;{"<Hello name={props.name} />;"}
      </Codeblock>
    </Card>
    <Card
      step={3}
      visible={value >= 3}
      title="Using a micro-frontend is like using an iframe"
      description="Properties are passed to micro-frontends as query parameters. It reduces the encapsulation between micro-frontends.">
      <Codeblock>
        {'<ragu-framework'}<br />
        &nbsp;&nbsp;{'src="http://my-micro-frontend-host/my-microfrontend?name=World" />'}
      </Codeblock>
    </Card>
  </CardGrid>;
}

export default App;

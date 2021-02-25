import React, {useEffect, useState} from 'react';
import {Card, CardGrid} from "./components/Card";
import {Codeblock} from "./components/Codeblock";
import SupportedFrameworks from './supported-frameworks.png';


const App = ()  => {
  const [value, setValue] = useState(1);

  useEffect(() => {
    value !== 3 && setTimeout(() => setValue(value + 1), 400);
  }, [value]);

  return <CardGrid>
    <Card
      step={1}
      visible={value >= 1}
      title="Create Micro-Frontends with a simple CLI"
      description="Instead of complex configurations you can just export your micro-frontend with “ragu-cli”."
    >
      <Codeblock>
        <strong className="accent">$ </strong>
        <span className="secondary">npx ragu-cli run </span>
        <span className="third">./my-component-name.js</span><br /><br />

        <strong>Welcome to 🔪 RaguServer</strong><br />
        The application is running at <span className="link">http://localhost:3100</span>
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
        <span className="comment"># my-hello-micro-frontend.jsx</span><br /><br />

        <span className="accent">export default</span> (props) =><br />
        &nbsp;&nbsp;
        <span className="secondary">{'<'}Hello</span> <span className="third">name=</span>{"{props.name}"}
        <span className="secondary">{'/>'}</span>;
      </Codeblock>
    </Card>
    <Card
      step={3}
      visible={value >= 3}
      title="Using a micro-frontend is like using an iframe"
      description="Properties are passed to micro-frontends as query parameters. It reduces the encapsulation between micro-frontends.">
      <Codeblock>
        <span className="secondary">{'<ragu-framework'}<br /></span>
        &nbsp;&nbsp;src<span className='third'>="http://my-micro-frontend-host/my-microfrontend?name=World"</span>
        <span className="secondary">{'/>'}</span>
      </Codeblock>
    </Card>
  </CardGrid>;
}

export default App;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useMessage, useSend } from "../../WebSocket";
import { Footnote, LargeTitle } from "@nightfall-ui/typography";
import { Button } from "@nightfall-ui/buttons";
import { Center } from "@nightfall-ui/layout";
import { Input } from "@nightfall-ui/inputs";
import { useForm } from "../../hooks";

const Home = () => {
  const navigate = useNavigate();
  const send = useSend();
  const { values: formValues, handleSubmit, ref } = useForm();

  useMessage("new-room", (message) => {
    const {
      room: { id: roomId },
    } = message;

    navigate(`/chat?chatid=${roomId}`);
  });

  const onSubmit = () => {
    send({ type: "create-room" });
  };

  return (
    <div>
      <Center small={95} tablet={90} laptop={50} desktop={40}>
        <LargeTitle as={"h1"} type={"primary"} weight={"bold"}>
          Telegraph
        </LargeTitle>
        <Footnote type={"primary"} weight={"regular"}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
          consequuntur debitis dicta eaque, fuga laboriosam laborum non pariatur
          quis tempore ullam velit. Amet eos error ipsum nobis saepe vel vitae!
        </Footnote>
        <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input name={"name"} placeholder={"Name"} />
          </div>
          <div>
            <Button
              type={"submit"}
              disabled={!formValues.name}
              shape={"oval"}
              size={"extra-large"}
              style={{
                marginRight: "1rem",
              }}
            >
              Create Chat
            </Button>
          </div>
        </form>
      </Center>
    </div>
  );
};

export default Home;

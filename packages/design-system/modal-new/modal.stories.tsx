import { useState } from "react";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Meta } from "@storybook/react";

import { Button } from "design-system/button";
import { Close } from "design-system/icon";
import { Text } from "design-system/text";

import { View } from "../view";
import { Modal } from "./index";
import { ModalHeader } from "./modal.header";

export default {
  component: ModalHeader,
  title: "Components/NewModal",
} as Meta;

const Container = (props: any) => {
  return <View tw={"dark:bg-white p-10 bg-black"}>{props.children}</View>;
};

export const HeaderDefault: React.VFC<{}> = () => {
  return (
    <Container>
      <ModalHeader title="Modal Header Title" tw={"bg-white dark:bg-black"} />
    </Container>
  );
};

export const HeaderWithEndContent: React.VFC<{}> = () => {
  return (
    <Container>
      <ModalHeader
        title="Modal Header Title"
        tw={"bg-white dark:bg-black"}
        endContentComponent={() => (
          <Button size="small" iconOnly>
            <Close />
          </Button>
        )}
      />
    </Container>
  );
};

export const Default: React.VFC<{}> = () => {
  const [visible, setVisible] = useState(false);

  const onClose = () => {
    console.log("onClose");
    setVisible(false);
  };
  return (
    <Container>
      <Button onPress={() => setVisible(!visible)}>
        <Text tw="text-white dark:text-black">Open modal</Text>
      </Button>
      {visible && (
        <Modal title="Modal Title" onClose={onClose}>
          <Button size="small" iconOnly>
            <Close />
          </Button>
        </Modal>
      )}
    </Container>
  );
};

export const WithScrollable: React.VFC<{}> = () => {
  const [visible, setVisible] = useState(false);

  const onClose = () => {
    console.log("onClose");
    setVisible(false);
  };
  return (
    <Container>
      <Button onPress={() => setVisible(!visible)}>Open modal</Button>
      {visible && (
        <Modal title="Modal Title" onClose={onClose}>
          <BottomSheetScrollView>
            {Array(50)
              .fill(0)
              .map((_, index) => (
                <Text
                  key={`${index}-item`}
                  tw="text-white p-1"
                >{`#${index} item`}</Text>
              ))}
          </BottomSheetScrollView>
        </Modal>
      )}
    </Container>
  );
};
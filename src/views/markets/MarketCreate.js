import React, { useRef, useState, useEffect } from "react";
import Address from "../../components/Address";
import ImageUpload from "../../components/images/ImageUpload";
import { ScrollContainer, Text } from "../../styles/Style";
import { AntDesign } from "@expo/vector-icons";
import {
  MarketInputForm,
  VerticalDiv,
  HorizontalDiv,
  TextInput,
  Btn,
  ThumbnailContainer,
  Image,
  LoginBtn,
  BtnText,
} from "../../styles/MarketStyle";
import { useMarketCreate, useMarketListWithId } from "../../hooks/marketHooks";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Alert } from "react-native";
import { usePhoneNumberFormat } from "../../hooks/util";
import marketSlice from "../../redux/slices/market";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const MarketInput = ({ navigation }) => {
  // Redux variables
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  // Hooks variables
  const [modal, setModal] = useState(false);
  const [marketImage, setMarketImage] = useState(null);
  const [address, setAddress] = useState(null);
  const [marketName, setMarketName] = useState(null);
  const [size, setSize] = useState(null);
  const [pos, setPos] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [income, setIncome] = useState(null);
  const [ref, setRef] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ref variables
  const nameRef = useRef();
  const sizeRef = useRef();
  const posRef = useRef();
  const phoneNumberRef = useRef();
  const incomeRef = useRef();
  const addressRef = useRef();

  // Handling funcstions
  const handleName = (text) => {
    setMarketName(text);
  };
  const handleSize = (text) => {
    setSize(text);
  };
  const handlePos = (text) => {
    setPos(text);
  };
  const handlePhoneNumber = (text) => {
    setPhoneNumber(text);
  };
  const handleIncome = (text) => {
    setIncome(text);
  };
  const handleModal = () => {
    setModal(true);
    ref?.scrollTo({ y: 0, animated: false });
  };
  const modalIsClosed = () => {
    ref?.scrollToEnd({ animated: false });
  };

  // Button activation
  const btnActivation = Boolean(
    marketImage && marketName && size && pos && phoneNumber && income && address
  );

  // Submit market info and process market creation
  const sumbitMarketInfo = async () => {
    if (isLoading) return;

    const marketObj = {
      marketImage,
      userId,
      marketName,
      size,
      pos,
      phoneNumber,
      income,
      address,
    };

    try {
      setIsLoading(true);
      // Market creation process
      const response = await useMarketCreate(marketObj, token);

      if (response) {
        // Update Market redux if the previous process was done successfully.
        const marketData = await useMarketListWithId(token);
        if (marketData) {
          dispatch(
            marketSlice.actions.setMarket({
              array: [...marketData],
            })
          );
        }
      }

      Alert.alert("??????", "????????? ????????? ?????????????????????.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("??????", String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollContainer ref={(ref) => setRef(ref)}>
      <KeyboardAwareScrollView>
        <MarketInputForm>
          {marketImage ? (
            <ThumbnailContainer>
              <Image source={{ uri: marketImage.uri }} />
            </ThumbnailContainer>
          ) : (
            <ThumbnailContainer>
              <AntDesign
                name="camerao"
                size={48}
                color="gray"
                style={{ padding: 20 }}
              />
              <Text style={{ color: "gray", marginBottom: 15 }}>
                ?????? ????????? ?????? ???????????? ??????????????????.
              </Text>
            </ThumbnailContainer>
          )}

          <Text>????????? ??????</Text>
          <ImageUpload
            placeholder={
              marketImage ? "????????? ??????" : "????????? ?????? ?????? (?????? ?????????)"
            }
            setMarketImage={setMarketImage}
          />

          <Text>????????????</Text>
          <TextInput
            placeholderTextColor="#000"
            placeholder="??????????????? ???????????????"
            value={marketName}
            onChangeText={(text) => handleName(text)}
            ref={nameRef}
            onSubmitEditing={() => sizeRef.current?.focus()}
          />

          <HorizontalDiv>
            <VerticalDiv>
              <Text>??????</Text>
              <TextInput
                placeholderTextColor="#000"
                placeholder="????????? ???????????????"
                value={size}
                onChangeText={(text) => handleSize(text)}
                ref={sizeRef}
                onSubmitEditing={() => posRef.current?.focus()}
                keyboardType="numeric"
              />
            </VerticalDiv>
            <VerticalDiv>
              <Text>POS ???</Text>
              <TextInput
                placeholderTextColor="#000"
                placeholder="POS ????????? ???????????????"
                value={pos}
                onChangeText={(text) => handlePos(text)}
                ref={posRef}
                onSubmitEditing={() => phoneNumberRef.current?.focus()}
                keyboardType="numeric"
              />
            </VerticalDiv>
          </HorizontalDiv>

          <HorizontalDiv>
            <VerticalDiv>
              <Text>????????????</Text>
              <TextInput
                placeholderTextColor="#000"
                placeholder="'-' ?????? ???????????????"
                value={phoneNumber}
                onChangeText={(text) => handlePhoneNumber(text)}
                keyboardType="numeric"
                autoCapitalize="none"
                onBlur={() => setPhoneNumber(usePhoneNumberFormat(phoneNumber))}
                ref={phoneNumberRef}
                onSubmitEditing={() => incomeRef.current?.focus()}
              />
            </VerticalDiv>
            <VerticalDiv>
              <Text>??? ?????? ??????</Text>
              <TextInput
                placeholderTextColor="#000"
                placeholder="??? ?????? ????????? ???????????????"
                value={income}
                onChangeText={(text) => handleIncome(text)}
                ref={incomeRef}
                onSubmitEditing={() => addressRef.current?.focus()}
                keyboardType="numeric"
              />
            </VerticalDiv>
          </HorizontalDiv>

          <Text>?????? ??????</Text>
          <Btn onPress={handleModal} ref={addressRef}>
            <Text>{address ? address : "?????? ??????"}</Text>
          </Btn>

          <LoginBtn
            onPress={sumbitMarketInfo}
            // style={{ backgroundColor: "#ff7d0d" }}
            style={{ backgroundColor: btnActivation ? "#ff7d0d" : "#aaa" }}
            disabled={!btnActivation || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <BtnText>????????????</BtnText>
            )}
          </LoginBtn>
        </MarketInputForm>

        {modal && (
          <Address
            setAddress={setAddress}
            setModal={setModal}
            modalIsClosed={modalIsClosed}
          />
        )}
      </KeyboardAwareScrollView>
    </ScrollContainer>
  );
};

export default MarketInput;

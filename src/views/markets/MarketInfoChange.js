import React, { useRef, useState } from "react";
import Address from "../../components/Address";
import ImageUpload from "../../components/images/ImageUpload";
import { BasicContainer, ScrollContainer, Text } from "../../styles/Style";
import {
  MarketInputForm,
  VerticalDiv,
  HorizontalDiv,
  TextInput,
  Btn,
  ThumbnailContainer,
  Image,
  FooterBtn,
  BtnContainer,
} from "../../styles/MarketStyle";
import {
  useMarketDelete,
  useMarketListWithId,
  useMarketUpdate,
} from "../../hooks/marketHooks";
import { ActivityIndicator, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { imageW600 } from "../../hooks/urlSetting";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import marketSlice from "../../redux/slices/market";

const MarketInfoChange = ({ navigation, route }) => {
  // Redux Variables
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  // Set market data from route params
  const marketData = route.params.marketData[0];

  // useState Variables
  const [modal, setModal] = useState(false);
  const [marketId] = useState(marketData._id);
  const [address, setAddress] = useState(marketData.marketAddress);
  const [marketImage, setMarketImage] = useState("");
  const [marketName, setMarketName] = useState(marketData.marketName);
  const [size, setSize] = useState(marketData.size);
  const [pos, setPos] = useState(marketData.pos);
  const [phoneNumber, setPhoneNumber] = useState(marketData.phone);
  const [income, setIncome] = useState(marketData.averageSales);
  const [changeLoading, setChangeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // useRef Varialbles
  const nameRef = useRef();
  const sizeRef = useRef();
  const posRef = useRef();
  const phoneRef = useRef();
  const incomeRef = useRef();
  const addressRef = useRef();

  // Handling Functions
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

  // Process Functions
  const processMarketDelete = async (marketId, token) => {
    const response = await useMarketDelete(marketId, token);

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

      Alert.alert("??????", "?????????????????????.");
      navigation.goBack();
    }
  };
  const triggerDeleteButton = (marketId, token) => {
    setDeleteLoading(true);

    try {
      Alert.alert("??????", "?????????????????????????", [
        { text: "???", onPress: () => processMarketDelete(marketId, token) },
        { text: "?????????" },
      ]);
    } catch (error) {
      Alert.alert("??????", error.message);
    } finally {
      setDeleteLoading(false);
    }
  };
  const submitNewMarketInfo = async () => {
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

    const response = await useMarketUpdate(marketObj, marketId, token);

    try {
      if (response) {
        console.log(response);
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

      Alert.alert("??????", "????????? ?????? ????????? ?????????????????????.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("??????", error.message);
    }
  };

  // Set BasicContainer - KeyboardAwareScrollView - ScrollContainer
  // in order to focus on the current cursor automatically
  return (
    <BasicContainer>
      <KeyboardAwareScrollView>
        <ScrollContainer>
          <MarketInputForm>
            <ThumbnailContainer>
              <Image
                source={
                  marketImage
                    ? { uri: marketImage.uri }
                    : { uri: imageW600 + marketData.marketImage }
                }
              />
            </ThumbnailContainer>

            <Text>????????? ??????</Text>
            <ImageUpload
              placeholder={
                marketData.image
                  ? "????????? ??????"
                  : "????????? ?????? ?????? (?????? ?????????)"
              }
              image={marketImage}
              setMarketImage={setMarketImage}
            />

            <Text>????????????</Text>
            <TextInput
              onChangeText={(text) => handleName(text)}
              value={marketName}
              ref={nameRef}
              onSubmitEditing={() => sizeRef.current?.focus()}
            />

            <HorizontalDiv>
              <VerticalDiv>
                <Text>??????</Text>
                <TextInput
                  onChangeText={(text) => handleSize(text)}
                  value={size}
                  ref={sizeRef}
                  onSubmitEditing={() => posRef.current?.focus()}
                />
              </VerticalDiv>

              <VerticalDiv>
                <Text>POS ???</Text>
                <TextInput
                  onChangeText={(text) => handlePos(text)}
                  value={pos}
                  ref={posRef}
                  onSubmitEditing={() => phoneRef.current?.focus()}
                />
              </VerticalDiv>
            </HorizontalDiv>

            <HorizontalDiv>
              <VerticalDiv>
                <Text>????????????</Text>
                <TextInput
                  onChangeText={(text) => handlePhoneNumber(text)}
                  value={phoneNumber}
                  ref={phoneRef}
                  onSubmitEditing={() => incomeRef.current?.focus()}
                />
              </VerticalDiv>
              <VerticalDiv>
                <Text>??? ?????? ??????</Text>
                <TextInput
                  onChangeText={(text) => handleIncome(text)}
                  value={income}
                  ref={incomeRef}
                  onSubmitEditing={() => addressRef.current?.focus()}
                />
              </VerticalDiv>
            </HorizontalDiv>

            <Text>?????? ??????</Text>
            <Btn onPress={() => setModal(true)} ref={addressRef}>
              <Text>{address ? address : "?????? ??????"}</Text>
            </Btn>

            {/* Submit and Remove Button Container */}
            <BtnContainer>
              <FooterBtn
                onPress={submitNewMarketInfo}
                style={{ backgroundColor: "#FF7D0D" }}
              >
                <Text style={{ color: "#fff" }}>
                  {changeLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    "????????????"
                  )}
                </Text>
              </FooterBtn>
              <FooterBtn
                onPress={() => triggerDeleteButton(marketId, token)}
                style={{ backgroundColor: "#B4B4B4" }}
              >
                <Text style={{ color: "#fff" }}>
                  {deleteLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    "????????????"
                  )}
                </Text>
              </FooterBtn>
            </BtnContainer>
          </MarketInputForm>

          {/* Address Modal Component */}
          {modal && <Address setAddress={setAddress} setModal={setModal} />}
        </ScrollContainer>
      </KeyboardAwareScrollView>
    </BasicContainer>
  );
};

export default MarketInfoChange;

import { StatusBar } from "expo-status-bar"
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import Button from "./components/button"
import { useEffect, useState } from "react"
import axios from "axios"
import SelectDropdown from "react-native-select-dropdown"
import JSONTree from "react-native-json-tree"

export default function App() {
  const [text, onChangeText] = useState("http://192.168.1.5:4000/ping")
  const [method, onChangeMethod] = useState("get")
  const [res, onChangeResponse] = useState("")
  const [status, onChangeStatus] = useState("")
  const [loading, setLoading] = useState(0)
  const [payload, setPayload] = useState("")
  const methods = ["get", "post", "put", "patch"]

  const onClear = () => {
    onChangeResponse("")
  }
  useEffect(() => {})

  const onSend = (e) => {
    e.preventDefault()
    onClear()
    // alert("Đang call api")
    setLoading(1)
    // console.log("method", method)

    axios({
      method: method,
      url: text,
      data: payload,
    })
      .then((response) => {
        setLoading(0)
        console.log(response.status)
        console.log(response.data)
        onChangeStatus(response.status)
        onChangeResponse(response)
      })
      .catch((e) => {
        setLoading(0)
        alert(e)
      })
  }

  return (
    <SafeAreaView style={styles.containerScroll}>
      <View style={styles.container}>
        <Text style={{ color: "#FFB534" }}>Welcome to app request api with axios</Text>
        <Text style={{ color: "#2F5D62" }}>Author: Khang Dev Sieu Cap Vip Pro</Text>
        <SelectDropdown
          data={methods}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index)
            onChangeMethod(selectedItem)
          }}
          buttonStyle={{ width: 150, height: 30 }}
          defaultButtonText="Select method"
          buttonTextStyle={{ color: "#AB46D2", fontSize: 12 }}
          defaultValue={methods[0]}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item
          }}
        />
        <TextInput style={styles.input} onChangeText={onChangeText} value={text} placeholder="http:// or https://" />
        <TextInput style={styles.inputPayload} onChangeText={setPayload} value={payload} placeholder="Payload (nếu có)" />
        {loading !== 0 && <Text style={{ color: "#65B741" }}>Loading...</Text>}
        {res !== "" && (
          <ScrollView style={styles.scrollView}>
            <View style={{ gap: 10, margin: 10, maxWidth: "auto" }}>
              <Text style={{ color: "#fff" }}>Ipv4: {res?.data?.data?.requestIp ?? ""}</Text>
              <Text style={{ color: "#fff" }}>Browser: {res?.data?.data?.browser ?? ""}</Text>
              <Text style={{ color: "#fff" }}>Status Code: {JSON.stringify(status)}</Text>
              <Text style={{ color: "#fff" }}>DataJson:</Text>
              <JSONTree data={res?.data} />
              <Text style={{ color: "#fff" }}>Request config:</Text>
              <JSONTree data={res?.config} />
            </View>
          </ScrollView>
        )}
        <View>
          <Button label={"Send"} onPress={onSend} />
          <Button label={"Clear"} onPress={onClear} />
        </View>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: "90%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputPayload: {
    height: 90,
    width: "90%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  containerScroll: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: "#9FBB73",
    marginHorizontal: 20,
    width: "100%",
    maxHeight: 400,
  },
})

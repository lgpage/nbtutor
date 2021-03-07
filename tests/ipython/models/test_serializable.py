from nbtutor.ipython.models.serializable import Serializable, snake_to_camel


def test_snake_to_camel_returns_expected_result():
    assert snake_to_camel("Foo_bar") == "fooBar"
    assert snake_to_camel("foo") == "foo"


class SerializableString(Serializable):
    def __init__(self) -> None:
        self.some_string = "string"


class SerializableNumber(Serializable):
    def __init__(self) -> None:
        self.some_int = 431
        self.some_float = 12.431


class SerializableIterable(Serializable):
    def __init__(self) -> None:
        self.some_list = [SerializableString(), SerializableNumber()]


class SerializableObject(Serializable):
    def __init__(self) -> None:
        self.some_bool = True
        self.some_none = None
        self.some_object = SerializableIterable()


class TestSerializable(object):
    def test_prepare_returns_expected_result(self):
        klass = SerializableObject()

        result = klass.to_dict()

        assert result["someBool"] == True
        assert result["someNone"] == None
        assert result["someObject"]["someList"][0]["someString"] == "string"
        assert result["someObject"]["someList"][1]["someInt"] == 431
        assert result["someObject"]["someList"][1]["someFloat"] == 12.431

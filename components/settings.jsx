const { React } = require("@vizality/webpack");
const {
  Category,
  SwitchItem,
  TextInput,
  SelectInput,
} = require("@vizality/components/settings");

module.exports = class BetterInviteSettings extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { getSetting, toggleSetting, updateSetting } = this.props;
    return (
      <>
        <Category
          name={"Toggles"}
          description={"Here you can change what shows up in the invite."}
          opened={getSetting("example-category-item", false)}
          onChange={() => toggleSetting("example-category-item")}
        >
          <SwitchItem
            value={getSetting("banner", true)}
            onChange={() => {
              toggleSetting("banner");
            }}
          >
            Server Banner (If available)
          </SwitchItem>
          <SwitchItem
            value={getSetting("avatar", true)}
            onChange={() => {
              toggleSetting("avatar");
            }}
          >
            Inviter PFP
          </SwitchItem>
          <SwitchItem
            value={getSetting("nsfw", true)}
            onChange={() => {
              toggleSetting("nsfw");
            }}
          >
            NSFW warning
          </SwitchItem>
          <SwitchItem
            value={getSetting("boost", true)}
            onChange={() => {
              toggleSetting("boost");
            }}
          >
            Server Boost level indicator
          </SwitchItem>
          <SwitchItem
            value={getSetting("verification", true)}
            onChange={() => {
              toggleSetting("verification");
            }}
          >
            Verification level indicator
          </SwitchItem>
          <SwitchItem
            value={getSetting("force-member-count", false)}
            onChange={() => toggleSetting("force-member-count")}
            note="When enabled, the member count replaces the channel."
          >
            Force Member Count
          </SwitchItem>
        </Category>
        <Category
          name={"Customization"}
          description={"Here you can change what stuff looks like."}
          opened={getSetting("example-category-item", false)}
          onChange={() => toggleSetting("example-category-item")}
        >
          <TextInput
            defaultValue={getSetting("borderradius", 28)}
            placeholder={28}
            required={false}
            onChange={(val) => {
              if (!isNaN(val) && isFinite(val) && /^\d+$/.test(val))
                updateSetting("borderradius", Number(val));
              if (!val) updateSetting("borderradius", 28);
            }}
          >
            Border Radius (Changes how round everything looks) (Only accepts
            numbers)
          </TextInput>
          <SelectInput
            value={getSetting("position", "banner-right")}
            options={[
              {
                value: "banner-left",
                label: "Banner Left",
              },
              {
                value: "banner-middle",
                label: "Banner Middle",
              },
              {
                value: "banner-right",
                label: "Banner Right",
              },
              {
                value: "join-button",
                label: "Join Button",
              },
            ]}
            onChange={(res) => updateSetting("position", res.value)}
          >
            Select where the icons get displayed
          </SelectInput>
        </Category>
      </>
    );
  }
};

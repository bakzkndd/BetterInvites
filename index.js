import React from "react";

import { patch, unpatch } from "@vizality/patcher";
import { getModule } from "@vizality/webpack";
import { Plugin } from "@vizality/entities";
import { Tooltip } from "@vizality/components";

const verificationInfo = {
  "level-0": {
    icon: "https://i.imgur.com/nBccUZa.png",
    name: "none",
  },
  "level-1": {
    icon: "https://i.imgur.com/98emMap.png",
    name: "low",
  },
  "level-2": {
    icon: "https://i.imgur.com/AZlG0eI.png",
    name: "medium",
  },
  "level-3": {
    icon: "https://i.imgur.com/lq0byEu.png",
    name: "high",
  },
  "level-4": {
    icon: "https://i.imgur.com/WRZhVSo.png",
    name: "highest",
  },
};

export default class BetterInvites extends Plugin {
  start() {
    this.patchInvites();
  }

  stop() {
    unpatch("better-invites-invite");
  }

  async patchInvites() {
    const Invite = getModule((m) => m.default?.displayName === "GuildInvite");
    patch("better-invites-invite", Invite, "default", (args, res) => {
      const containerStyle = {
        position: "relative",
        "margin-bottom": "1%",
      };

      const bannerStyle = {
        width: "100%",
        height: "100px",
        "border-radius": "28px 28px 0px 0px",
        "object-fit": "cover",
      };

      const avatarStyle = {
        height: "28px",
        "border-radius": "5px",
        "object-fit": "contain",
      };

      const boostStyle = {
        height: "28px",
        "border-radius": "5px",
        "object-fit": "contain",
      };

      const verificationStyle = {
        height: "28px",
        "border-radius": "5px",
        "object-fit": "contain",
      };

      const svgStyle = {
        height: "28px",
        width: "28px",
      };

      const wrapperStyle = {
        display: "grid",
        grid: "auto / auto auto",
        direction: "rtl",
        "grid-gap": "3px",
      };

      containerStyle.display = this.settings.get("banner", true)
        ? "initial"
        : "none";
      avatarStyle.display = this.settings.get("avatar", true)
        ? "initial"
        : "none";
      boostStyle.display = this.settings.get("boost", true)
        ? "initial"
        : "none";
      verificationStyle.display = this.settings.get("verification", true)
        ? "initial"
        : "none";
      svgStyle.display = this.settings.get("nsfw", true) ? "initial" : "none";

      bannerStyle["border-radius"] =
        this.settings.get("borderradius", 28) +
        "px " +
        this.settings.get("borderradius", 28) +
        "px 0px 0px";
      avatarStyle["border-radius"] =
        this.settings.get("borderradius", 28) / 4 + "px";
      boostStyle["border-radius"] =
        this.settings.get("borderradius", 28) / 4 + "px";
      verificationStyle["border-radius"] =
        this.settings.get("borderradius", 28) / 4 + "px";

      let invite = args[0].invite;
      let guild = invite.guild;
      let inviter = invite.inviter;

      let boostLevel = "0";
      if (guild.features.includes("VANITY_URL")) boostLevel = "3";
      else if (guild.features.includes("BANNER")) boostLevel = "2";
      else if (guild.features.includes("ANIMATED_ICON")) boostLevel = "1";
      if (boostLevel == "0") boostStyle.display = "none";
      else boostStyle.display = "initial";

      if (!inviter) avatarStyle.display = "none";
      else avatarStyle.display = "initial";

      if (guild?.nsfw == false) svgStyle.display = "none";
      else svgStyle.display = "initial";

      if (guild?.verification_level == 0) verificationStyle.display = "none";
      else verificationStyle.display = "initial";

      let inBanner = true;
      if (invite?.guild?.banner) {
        if (this.settings.get("position", "banner-right") == "banner-right") {
          wrapperStyle.right = "0px";
          wrapperStyle["border-radius"] =
            this.settings.get("borderradius", 28) + "px " + "0px 0px 0px";
          wrapperStyle["padding-left"] = "5px";
        } else if (
          this.settings.get("position", "banner-right") == "banner-left"
        ) {
          wrapperStyle.left = "0px";
          wrapperStyle["border-radius"] =
            "0px " + this.settings.get("borderradius", 28) + "px 0px 0px";
          wrapperStyle["padding-right"] = "5px";
        } else if (
          this.settings.get("position", "banner-right") == "banner-middle"
        ) {
          wrapperStyle.left = "50%";
          wrapperStyle["border-radius"] =
            this.settings.get("borderradius", 28) +
            "px " +
            this.settings.get("borderradius", 28) +
            "px 0px 0px";
          wrapperStyle["padding-right"] = "5px";
          wrapperStyle["padding-left"] = "5px";
          wrapperStyle["transform"] = "translate(-50%)";
        } else inBanner = false;

        if (inBanner) {
          wrapperStyle.position = "absolute";
          wrapperStyle.top = "-17px";
          wrapperStyle["grid"] = "auto / auto auto auto auto";
          wrapperStyle.background = "rgba(0, 0, 0, 0.8)";
          wrapperStyle["padding-top"] = "5px";
          avatarStyle["border-radius"] =
            this.settings.get("borderradius", 28) + "px";
        }

        res.props.children.splice(
          1,
          0,
          <div style={containerStyle}>
            <img
              src={`https://cdn.discordapp.com/banners/${guild?.id}/${guild?.banner}.jpg?size=1024`}
              style={bannerStyle}
            />
            {inBanner ? (
              <div className="iconWrapper" style={wrapperStyle}>
                <div style={verificationStyle}>
                  <Tooltip
                    text={`Verification level: ${
                      verificationInfo[`level-${guild?.verification_level}`]
                        .name
                    }`}
                    position="top"
                    style={verificationStyle}
                  >
                    <img
                      src={
                        verificationInfo[`level-${guild?.verification_level}`]
                          .icon
                      }
                      style={verificationStyle}
                    />
                  </Tooltip>
                </div>
                <div style={boostStyle}>
                  <Tooltip
                    text={`Boost level: ${boostLevel}`}
                    position="top"
                    style={boostStyle}
                  >
                    <img
                      src={`https://i.imgur.com/Cfuppku.png`}
                      style={boostStyle}
                    />
                  </Tooltip>
                </div>
                <div style={avatarStyle}>
                  <Tooltip
                    text={`Invited by: ${inviter?.username}#${inviter?.discriminator}`}
                    position="top"
                    style={avatarStyle}
                  >
                    <img
                      src={`https://cdn.discordapp.com/avatars/${inviter?.id}/${inviter?.avatar}.gif?size=1024`}
                      style={avatarStyle}
                      onError={(e) => {
                        if (
                          e.target.src !=
                          `https://cdn.discordapp.com/avatars/${inviter?.id}/${inviter?.avatar}.png?size=1024`
                        )
                          e.target.src = `https://cdn.discordapp.com/avatars/${inviter?.id}/${inviter?.avatar}.png?size=1024`;
                      }}
                    />
                  </Tooltip>
                </div>
                <div style={svgStyle}>
                  <Tooltip
                    text={`NSFW server!
                    Level: ${guild.nsfw_level}`}
                    position="top"
                    style={svgStyle}
                  >
                    <svg style={svgStyle}>
                      <path
                        fill="#ed4043"
                        fill-rule="evenodd"
                        d="M 17.1656 2.208 L 26.5752 21.226 C 27.8904 23.8848 25.9564 27 22.99 27 L 4.0716 27 C 1.098 27 -0.836 23.8708 0.494 21.2112 L 10.0028 2.1932 C 11.4804 -0.762 15.7004 -0.7532 17.1656 2.208 Z M 11.5992 7 H 15.5996 V 17 H 11.5996 L 11.5992 7 Z M 11.5992 20.9956 C 11.5992 22.1036 12.4952 23 13.5992 23 C 14.7036 23 15.5996 22.1036 15.5996 20.9956 C 15.5996 19.8892 14.7036 18.9908 13.5992 18.9908 C 12.4952 18.9908 11.5992 19.8892 11.5992 20.9956 Z"
                      />
                    </svg>
                  </Tooltip>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        );
      }
      if (!guild?.banner || (guild?.banner && !inBanner)) {
        res.props.children[guild?.banner ? 2 : 1].props.children.splice(
          2,
          0,
          <div className="iconWrapper" style={wrapperStyle}>
            <div style={verificationStyle}>
              <Tooltip
                text={`Verification level: ${
                  verificationInfo[`level-${guild?.verification_level}`].name
                }`}
                position="top"
                style={verificationStyle}
              >
                <img
                  src={
                    verificationInfo[`level-${guild?.verification_level}`].icon
                  }
                  style={verificationStyle}
                />
              </Tooltip>
            </div>
            <div style={boostStyle}>
              <Tooltip
                text={`Boost level: ${boostLevel}`}
                position="top"
                style={boostStyle}
              >
                <img
                  src={`https://i.imgur.com/Cfuppku.png`}
                  style={boostStyle}
                />
              </Tooltip>
            </div>
            <div style={avatarStyle}>
              <Tooltip
                text={`Invited by: ${inviter?.username}#${inviter?.discriminator}`}
                position="top"
                style={avatarStyle}
              >
                <img
                  src={`https://cdn.discordapp.com/avatars/${inviter?.id}/${inviter?.avatar}.gif?size=1024`}
                  style={avatarStyle}
                  onError={(e) => {
                    if (
                      e.target.src !=
                      `https://cdn.discordapp.com/avatars/${inviter?.id}/${inviter?.avatar}.png?size=1024`
                    )
                      e.target.src = `https://cdn.discordapp.com/avatars/${inviter?.id}/${inviter?.avatar}.png?size=1024`;
                  }}
                />
              </Tooltip>
            </div>
            <div style={svgStyle}>
              <Tooltip
                text={`NSFW server!
            Level: ${guild.nsfw_level}`}
                position="top"
                style={svgStyle}
              >
                <img src="https://i.imgur.com/FshBCpt.png" style={svgStyle} />
              </Tooltip>
            </div>
          </div>
        );
      }

      return res;
    });
  }
}

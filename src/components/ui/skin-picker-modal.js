"use client";

import { useState, useContext } from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { User } from "lucide-react";

import { LanguageContext } from "@/context/LanguageContext";

import ServiceUser from "@/services/Service.User.js";
import STATUS from "@/http/status";

import { toast } from "react-toastify";

export function SkinPickerModal({ isOpen, onClose, currentUsername }) {
  const { translations } = useContext(LanguageContext);

  const [username, setUsername] = useState(currentUsername);
  const [isLoading, setIsLoading] = useState(false);

  const [skinPreviewUrl, setSkinPreviewUrl] = useState(
    `https://minotar.net/armor/body/${currentUsername}/100.png`,
  );

  const handlePreview = () => {
    if (username.trim()) {
      setSkinPreviewUrl(
        `https://minotar.net/armor/body/${username.trim()}/100.png`,
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePreview();
    setIsLoading(true);
    ServiceUser.changeskin(username).then((json) => {
      if (json.status === STATUS.SUCCESS) {
        setSkinPreviewUrl(`https://minotar.net/armor/body/${username}/100.png`);
        toast.success(translations?.toast_messages[json?.code || 100]);
        setIsLoading(false);
      } else toast.error(translations?.toast_messages[json?.code || 200]);

      setIsLoading(false);
      onClose();
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={translations.skin_title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{translations.minecraft_username}</Label>
            <div className="flex gap-2">
              <Input
                id="username"
                placeholder={translations.enter_minecraft_username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button type="button" variant="outline" onClick={handlePreview}>
                {translations.preview}
              </Button>
            </div>
          </div>

          <div className="flex justify-center py-6">
            {username ? (
              <div className="relative group">
                <img
                  src={skinPreviewUrl || "/placeholder.svg"}
                  alt={`${username}'s skin`}
                  className="min-w-[100px] transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = `https://minotar.net/armor/body/steve/100.png`;
                  }}
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-opacity">
                  <User className="w-6 h-6" />
                </div>
              </div>
            ) : (
              <div className="w-[100px] h-[200px] bg-muted flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} type="button">
            {translations.cancel}
          </Button>
          <Button type="submit" disabled={!username.trim() || isLoading}>
            {isLoading ? translations.applyinprogress : translations.apply}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

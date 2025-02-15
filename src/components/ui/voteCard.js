"use client";

import { useEffect, useState, useContext } from "react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { Vote, ChevronRight, Trophy } from "lucide-react";
import { toast } from "react-toastify";

import { cn } from "@/lib/utils";

import { LanguageContext } from "@/context/LanguageContext";

import ServicePool from "@/services/Service.Poll";
import STATUS from "@/http/status";

export default function VoteCard() {
  const { translations } = useContext(LanguageContext);

  const [isVoted, setIsVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [poll, setPoll] = useState({});
  const lang = localStorage.getItem("language");

  useEffect(() => {
    if (!translations) return;
    ServicePool.polls().then((json) => {
      if (json.status === STATUS.SUCCESS) {
        const content = json?.content[0];
        setPoll(content);
        setIsVoted(content.is_voted);
        setIsExpired(content?.close_ts < Date.now());
        if (content.is_voted) setSelectedOption(content.voted_answer?.id);

        return setIsLoading(false);
      } else {
        toast.error(translations?.toast_messages[json?.code || 200]);
        deleteCookie("Authorization");
        return router.push("/login");
      }
    });
  }, [translations]);

  const handleVote = async (optionId) => {
    setIsLoading(true);
    if (isVoted) {
      ServicePool.unvote(poll.id, optionId).then((json) => {
        if (json.status === STATUS.SUCCESS) {
          setPoll(json?.content);
          setIsLoading(false);
          setIsVoted(false);
          toast.success(translations?.toast_messages[json?.code || 100]);
          return setSelectedOption(null);
        } else toast.error(translations?.toast_messages[json?.code || 200]);
      });
    } else {
      ServicePool.vote(poll.id, optionId).then((json) => {
        if (json.status === STATUS.SUCCESS) {
          setPoll(json?.content);
          setIsLoading(false);
          setIsVoted(true);
          toast.success(translations?.toast_messages[json?.code || 100]);
          return setSelectedOption(optionId);
        } else toast.error(translations?.toast_messages[json?.code || 200]);
      });
    }

    setSelectedOption(optionId);

    setIsVoted(true);
  };

  const getVotePercentage = (votes) => {
    const percentage = ((votes / poll?.votes_count) * 100).toFixed(1);
    return isNaN(percentage) ? 0 : percentage;
  };

  const getWinningOption = () => {
    if (!isExpired) return null;
    return poll.answers.reduce((prev, current) =>
      prev.votes_count > current.votes_count ? prev : current,
    );
  };

  const winningOption = getWinningOption();

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">
              {poll?.info && poll?.info[lang]?.title}
            </CardTitle>
            <CardDescription className="text-base">
              {poll?.info && poll?.info[lang]?.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            <Vote className="mr-1 h-4 w-4" />
            {poll?.votes_count} голосов
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {poll?.answers?.map((option) => (
            <div key={option.id} className="space-y-2">
              <Button
                variant={selectedOption === option.id ? "default" : "outline"}
                className={cn(
                  "w-full justify-between group relative",
                  isExpired &&
                    winningOption?.id === option.id &&
                    "border-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20",
                )}
                disabled={
                  isLoading ||
                  isExpired ||
                  (isVoted && selectedOption !== option.id)
                }
                onClick={() => handleVote(option.id)}
              >
                <span className="flex items-center gap-2">
                  {option?.local && option?.local[lang]}
                  {isExpired && winningOption?.id === option.id && (
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  )}
                  {selectedOption === option.id && isLoading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  )}
                </span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>

              {(isVoted || isExpired) && (
                <div className="space-y-1 animate-in fade-in-50 duration-500">
                  <Progress
                    value={Number.parseFloat(
                      getVotePercentage(option.votes_count),
                    )}
                    className={cn(
                      isExpired &&
                        winningOption?.id === option.id &&
                        "bg-yellow-500/20 [&>[role=progressbar]]:bg-yellow-500",
                    )}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground px-1">
                    <span>{option.votes_count} голосов</span>
                    <span>{getVotePercentage(option.votes_count)}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

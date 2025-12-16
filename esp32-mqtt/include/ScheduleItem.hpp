class ScheduleItem {
  private:
      int hour;
      int minute;
      bool enabled;

  public:
    ScheduleItem(int h, int m, bool en) : hour(h), minute(m), enabled(en) {}
    int getHour();
    int getMinute();
    bool getEnabled();
};